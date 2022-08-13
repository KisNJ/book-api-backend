const Blog = require("../models/blog");
const Comment = require("../models/comment");

const getApiIndexPage = (req, res) => {
  res.json({
    blogs: "See every public blog",
    blogsslashid: "See sepcific blog",
    blogsslashmine: "See every blog created by you",
  });
};

const getAllPublicBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ public: true });
    res.json(blogs);
  } catch (error) {
    next(error);
  }
};

const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).populate({
      path: "comments.author",
      // populate: { path: "author" },
    });
    res.json(blog);
  } catch (error) {
    next(error);
  }
};

const creteNewBlog = async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) throw new Error("Login to create a new blog");
    await Blog.create({
      author: req.user._id,
      title: req.body.title,
      content: req.body.title,
      public: req.body.public,
      created_at: new Date(),
      comments: [],
    });
  } catch (error) {
    next(error);
  }
};
const createNewComment = async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) throw new Error("Login to comment");
    const commentCreated = await Comment.create({
      author: req.user._id,
      content: req.body.title,
      created_at: new Date(),
      blog_id: req.params.id,
    });
    await Blog.findById(commentCreated.blog_id, {
      $push: { comments: commentCreated._id },
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getApiIndexPage,
  getAllPublicBlogs,
  getBlogById,
  creteNewBlog,
  createNewComment,
};
