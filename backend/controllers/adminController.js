const User = require("../models/user");
const Post = require("../models/post");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ADMIN_USERNAME = "Admin";
const ADMIN_PASSWORD = "Mano@123";

const generateToken = (id, username) => {
  return jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

/**
 * Admin login - only Admin/Mano@123 is valid.
 * Returns "Invalid Login" for wrong credentials.
 * Returns "Access Denied" if user exists but is not admin.
 */
const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: "Invalid Login" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid Login" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Login" });
    }

    if (user.role !== "ADMIN") {
      return res.status(403).json({ message: "Access Denied" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Access Denied" });
    }

    res.status(200).json({
      message: "Login successful",
      user: { _id: user.id, username: user.username, role: user.role },
      token: generateToken(user.id, user.username),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Invalid Login" });
  }
};

/**
 * View all blog posts
 */
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Create a new blog post
 */
const createPost = async (req, res) => {
  const { title, summary, content, category, cover } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content required" });
  }

  try {
    const newPost = new Post({
      title: title || "Untitled",
      summary: summary || "",
      content,
      category: category || "General",
      cover: cover || "",
      author: req.user.username,
    });
    await newPost.save();
    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Edit a blog post
 */
const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, summary, content, category, cover } = req.body;

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, summary, content, category, cover },
      { new: true }
    );

    res.status(200).json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete a blog post
 */
const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * View all users
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ _id: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Block a user
 */
const blockUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "ADMIN") {
      return res.status(400).json({ message: "Cannot block admin user" });
    }

    user.isBlocked = true;
    await user.save();
    res.status(200).json({ message: "User blocked successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Unblock a user
 */
const unblockUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = false;
    await user.save();
    res.status(200).json({ message: "User unblocked successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete a user
 */
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "ADMIN") {
      return res.status(400).json({ message: "Cannot delete admin user" });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * View all comments (from all posts)
 */
const getAllComments = async (req, res) => {
  try {
    const posts = await Post.find()
      .select("title _id comments")
      .sort({ createdAt: -1 });

    const commentsWithPost = posts.flatMap((post) =>
      (post.comments || []).map((comment) => ({
        ...comment.toObject(),
        postId: post._id,
        postTitle: post.title,
      }))
    );

    res.status(200).json(commentsWithPost);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete a comment from a post
 */
const deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments = post.comments.filter(
      (c) => c._id.toString() !== commentId
    );
    await post.save();

    res.status(200).json({ message: "Comment deleted successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  adminLogin,
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  getAllUsers,
  blockUser,
  unblockUser,
  deleteUser,
  getAllComments,
  deleteComment,
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
};
