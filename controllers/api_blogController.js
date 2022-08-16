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
    const blogs = await Blog.find({ public: true }).populate(
      "author",
      "-password",
    );
    res.json(blogs);
  } catch (error) {
    res.sendStatus(500);
  }
};

const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author")
      .populate({
        path: "comments.author",
      });
    // console.log(req.user._id === blog.author._id);
    // console.log(blog.author._id);
    // console.log(req.user);
    if (blog.author._id.toString() === req.user._id.toString()) {
      console.log("It1s yours ");
    }
    if (blog.public === false && blog.author._id !== req.user._id) {
      res.send(401).json({ msg: "Only the owner can see private blogs!" });
    } else {
      res.json(blog);
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Error maybe check your url or internet connection!" });
  }
};

const creteNewBlog = async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      res.sendStatus(401);
    } else {
      await Blog.create({
        author: req.user._id,
        title: req.body.title,
        content: req.body.content,
        public: req.body.public,
        created_at: new Date(),
        comments: [],
      });
      res.sendStatus(200);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(401);
  }
};
const createNewComment = async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      res.sendStatus(401);
    }
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
