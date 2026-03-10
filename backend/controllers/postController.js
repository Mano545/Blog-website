const Post = require("../models/post");

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const getPostsByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const posts = await Post.find({ category: { $regex: new RegExp(category, "i") } }).sort({ createdAt: -1 });
        if (posts.length === 0) {
            return res.status(404).json({ message: "No posts found in this category" });
        }
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const createPost = async (req, res) => {
    const { title, summary, content, category, cover } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: "Title and content required" });
    }

    try {
        // Author comes from the Token now, not the body
        const newPost = new Post({
            title,
            summary,
            content,
            category,
            cover,
            author: req.user.username
        });
        await newPost.save();
        res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, summary, content, cover } = req.body;

    try {
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // Authorization Check
        if (post.author !== req.user.username) {
            return res.status(401).json({ message: "User not authorized" });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { title, summary, content, cover },
            { new: true }
        );

        res.status(200).json({ message: "Post updated successfully", post: updatedPost });
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // Authorization Check
        if (post.author !== req.user.username) {
            return res.status(401).json({ message: "User not authorized" });
        }

        await Post.findByIdAndDelete(id);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const likePost = async (req, res) => {
    const { id } = req.params;
    // User from token
    const username = req.user.username;

    try {
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const index = post.likes.indexOf(username);
        if (index === -1) {
            post.likes.push(username);
        } else {
            post.likes.splice(index, 1);
        }

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        console.error("Error liking post:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const commentPost = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const username = req.user.username;

    if (!content) return res.status(400).json({ message: "Content required" });

    try {
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const newComment = {
            author: username,
            content,
            createdAt: new Date(),
        };

        post.comments.push(newComment);
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getPosts,
    getPostsByCategory,
    createPost,
    updatePost,
    deletePost,
    likePost,
    commentPost
};
