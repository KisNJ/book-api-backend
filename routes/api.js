const express = require("express");

const router = express.Router();
const apiBlog = require("../controllers/api_blogController");

router.get("/", apiBlog.getApiIndexPage);

router.get("/blogs", apiBlog.getAllPublicBlogs);
router.get("/blogs/:id/comment", apiBlog.createNewComment);
router.get("/blogs/:id", apiBlog.getBlogById);
router.post("/blogs/:id", apiBlog.creteNewBlog);
module.exports = router;
