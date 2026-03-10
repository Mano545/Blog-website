const express = require("express");
const router = express.Router();
const {
    getPosts,
    getPostsByCategory,
    createPost,
    updatePost,
    deletePost,
    likePost,
    commentPost,
} = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getPosts);
router.get("/category/:category", getPostsByCategory);

// Protected routes
router.post("/create", protect, createPost); // /posts/create
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.put("/:id/like", protect, likePost);
router.post("/:id/comment", protect, commentPost);

module.exports = router;
