const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const Post = require("./models/post");
const env = require('dotenv');
const app = express();
const PORT = process.env.PORT || 4008;
env.config();
app.use(cors());
app.use(express.json());

const conn = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};

conn();

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Username already taken" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid username or password" });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid username or password" });
    res.status(200).json({ message: "Login successful", user: { username: user.username } });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/create-post", async (req, res) => {
  const { title, summary, content, category, cover, author } = req.body;

  try {
    const newPost = new Post({ title, summary, content, category, cover, author });
    await newPost.save();
    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.put("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { title, summary, content, cover } = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, summary, content, cover },
      { new: true } 
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
app.get("/posts/category/:category", async (req, res) => {
  const { category } = req.params;

  try {
    const posts = await Post.find({ category: { $regex: new RegExp(category, "i") } }).sort({ createdAt: -1 });

    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found in this category" });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching category posts:", error);
    res.status(500).json({ message: "Server error" });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});