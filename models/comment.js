const mongoose = require("mongoose");

const { Schema } = mongoose;

const Comment = new Schema({
  author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  content: { type: String, required: true },
  created_at: { type: Date, required: true },
  blog_id: { ref: "Blog", type: Schema.Types.ObjectId },
});

module.exports = mongoose.model("Comment", Comment);
