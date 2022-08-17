const express = require("express");

const router = express.Router();
const apiBlog = require("../controllers/api_blogController");

router.get("/", apiBlog.getApiIndexPage);

router.get("/blogs", apiBlog.getAllPublicBlogs);
router.post("/blogs", apiBlog.creteNewBlog);
router.get("/blogs/own", apiBlog.getAllOwnBlogs);
router.delete("/blogs/:id/comment/:commentID", apiBlog.deleteComment);
router.put("/blogs/:id/comment/:commentID", apiBlog.updateComment);
router.post("/blogs/:id/comment", apiBlog.createNewComment);
router.get("/blogs/:id", apiBlog.getBlogById);
router.delete("/blogs/:id", apiBlog.deleteBlog);
router.put("/blogs/:id", apiBlog.updateBlog);
module.exports = router;
