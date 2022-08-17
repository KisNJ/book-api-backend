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
        path: "comments",
        populate: {
          path: "author",
        },
      });
    if (
      blog.public === false &&
      blog.author._id.toString() !== req.user._id.toString()
    ) {
      res.status(401).json({ msg: "Only the owner can see private blogs!" });
    } else {
      res.json(blog);
    }
  } catch (error) {
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
  console.log("aaa");
  try {
    if (!req.user || !req.isAuthenticated()) {
      res.sendStatus(401);
    } else {
      const commentCreated = await Comment.create({
        author: req.user._id,
        content: req.body.content,
        created_at: new Date(),
        blog_id: req.params.id,
      });
      await Blog.updateOne(
        { _id: commentCreated.blog_id },
        {
          $push: { comments: { $each: [commentCreated._id], $position: 0 } },
        },
      );
      res.sendStatus(200);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
const deleteComment = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      res.sendStatus(401);
    } else {
      const comment_id = req.params.commentID;
      const blog_id = req.params.id;
      if (!comment_id || !blog_id) {
        res.sendStatus(400);
      } else {
        const findComment = await Comment.findById(comment_id).populate(
          "author",
        );
        if (findComment.author._id.toString() !== req.user._id.toString()) {
          res.sendStatus(401);
        } else {
          await Comment.deleteOne({ _id: comment_id });

          await Blog.updateOne(
            { _id: blog_id },
            {
              $pull: {
                comments: comment_id,
              },
            },
          );
          res.sendStatus(200);
        }
      }
    }
  } catch (error) {
    res.sendStatus(500);
  }
};

const updateComment = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      res.sendStatus(401);
    } else {
      const comment_id = req.params.commentID;
      const blog_id = req.params.id;
      if (!comment_id || !blog_id) {
        res.sendStatus(400);
      } else {
        const findComment = await Comment.findById(comment_id).populate(
          "author",
        );
        if (findComment.author._id.toString() !== req.user._id.toString()) {
          res.sendStatus(401);
        } else {
          await Comment.updateOne(
            { _id: comment_id },
            { $set: { content: req.body.content } },
            { runValidators: true },
          );
          res.sendStatus(200);
        }
      }
    }
  } catch (error) {
    res.sendStatus(500);
  }
};

const deleteBlog = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      res.sendStatus(401);
    } else {
      const blog_id = req.params.id;
      if (!blog_id) {
        res.sendStatus(400);
      } else {
        const findBlog = await Blog.findById(blog_id).populate("author");
        if (findBlog.author._id.toString() !== req.user._id.toString()) {
          res.sendStatus(401);
        } else {
          await Blog.updateOne({ _id: blog_id }, { ...content });
          res.sendStatus(200);
        }
      }
    }
  } catch (error) {
    res.sendStatus(500);
  }
};
const updateBlog = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      res.sendStatus(401);
    } else {
      const blog_id = req.params.id;
      if (!blog_id) {
        res.sendStatus(400);
      } else {
        const findBlog = await Blog.findById(blog_id).populate("author");
        if (findBlog.author._id.toString() !== req.user._id.toString()) {
          res.sendStatus(401);
        } else {
          await Blog.updateOne({ _id: blog_id }, { ...req.body.content });
          res.sendStatus(200);
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
const getAllOwnBlogs = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      res.sendStatus(401);
    } else {
      const private = await Blog.find({
        author: req.user._id,
        public: false,
      }).populate("author");
      const public = await Blog.find({
        author: req.user._id,
        public: true,
      }).populate("author");

      res.status(200).json({ private, public });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
module.exports = {
  getApiIndexPage,
  getAllPublicBlogs,
  getBlogById,
  creteNewBlog,
  createNewComment,
  deleteComment,
  updateComment,
  deleteBlog,
  updateBlog,
  getAllOwnBlogs,
};
