//const { MongoAPIError } = require("mongodb");
const PostService = require("../services/post.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async(req, res, next) => {
    if(!req.body?.title) {
        return next(new ApiError(400, "Title can not be empty"));
   }

    try {
       const postService = new PostService(MongoDB.client);
       const document = await postService.create(req.body);
       return res.send(document);
   } catch (error) {
       return next(
           new ApiError(500, "An error occurred while creating the post")
       );
   }
};

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const postService = new PostService(MongoDB.client);
        const { title } = req.query;
        if (title) {
            documents = await postService.findByName(title);
        }else{
            documents = await postService.find({});
        }
   } catch (error){
        return next(
            new ApiError(500, "An error occurred while retrieving posts")
        );
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try{
        const postService = new PostService(MongoDB.client);
        const document = await postService.findById(req.params.id);
        if(!document){
            return next(new ApiError(404, "Post not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Error retrieving post with id=${req.params.id}`
            )
        );
    }
};

exports.update = async(req, res, next) => {
    if (Object.keys(req.body).length == 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        const postService = new PostService(MongoDB.client);
        const document = await postService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Post not found"));
        }
        return res.send({ message: "Post was update successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error updating post with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const postService = new PostService(MongoDB.client);
        const document = await postService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Post not found"));
        }
        return res.send({ message: "Post was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error delete post with id=${req.params.id}`)
        );
    }
};

exports.findAllCompleted = async (_req, res, next) => {
    try {
        const postService = new PostService(MongoDB.client);
        const documents = await postService.findCompleted();
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving completed posts")
        );
    }
};

exports.deleteAll = async (_req, res, next) => {
    try {
        const postService = new PostService(MongoDB.client);
        const deletedCount = await postService.deleteAll();
        return res.send({
            message: `${deletedCount} posts were deleted successfully`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while removing all posts")
        );
    }
};

// exports.create = (req, res) => {
//     res.send({ message: "create handler" });
//  };

//  exports.findAll = (req, res) => {
//     res.send({ message: "findAll handler" });
//  };

// exports.findOne = (req, res) => {
//    res.send({ message: "findOne handler" });
// };

// exports.update = (req, res) => {
//    res.send({ message: "update handler" });
// };

// exports.delete = (req, res) => {
//    res.send({ message: "Contact was deleted successfully" });
// };

// exports.deleteAll = (req, res) => {
//    res.send({ message: "deleteAll handler" });
// };

// exports.findAllFavorite = (req, res) => {
//     res.send({ message: "findAllFavorite handler" });
// };


