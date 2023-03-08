const express = require("express");
const posts = require("../controllers/post.controller");

const router = express.Router();

router.route("/")
    .get(posts.findAll)
    .post(posts.create)
    .delete(posts.deleteAll);

router.route("/completed")
    .get(posts.findAllCompleted);

router.route("/:id")
    .get(posts.findOne)
    .put(posts.update)
    .delete(posts.delete);

module.exports = router;