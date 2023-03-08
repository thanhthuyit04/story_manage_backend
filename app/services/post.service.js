const { ObjectId } = require("mongodb");

class PostService {
    constructor(client) {
        this.Post = client.db().collection("posts");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    extractConactData(payload) {
        const post = {
            image: payload.image,
            title: payload.title,
            author: payload.author, 
            des: payload.des,
            completed: payload.completed,
        };
        // Remove undefined fields
        Object.keys(post).forEach(
            (key) => post[key] === undefined && delete post[key]
        );
        return post;
    }

    async create(payload) {
        const post = this.extractConactData(payload);
        const result = await this.Post.findOneAndUpdate(
            post,
            { $set: { completed: post.completed === true } },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.Post.find(filter);
        return await cursor.toArray();
    }
    
    async findByName(title) {
        return await this.find({
            name: { $regex: new RegExp(title), $options: "i" },
        });
    }

    async findById(id) {
        return await this.Post.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractConactData(payload);
        const result = await this.Post.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.Post.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }

    async findCompleted(){
        return await this.find({ completed: true });
    }

    async deleteAll(){
        const result = await this.Post.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = PostService;