const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  cover: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  author: { type: String, required: true },
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
