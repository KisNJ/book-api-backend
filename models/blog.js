const mongoose = require("mongoose");

const { Schema } = mongoose;

const Blog = new Schema({
  author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  created_at: { type: Date, required: true },
  public: { type: Boolean, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

module.exports = mongoose.model("Blog", Blog);
