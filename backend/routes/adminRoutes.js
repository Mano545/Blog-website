const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/adminController");
const { protectAdmin } = require("../middleware/adminMiddleware");

// Public - Admin login only
router.post("/login", adminLogin);

// All routes below require ADMIN role
router.use(protectAdmin);

// Posts
router.get("/posts", getAllPosts);
router.post("/posts", createPost);
router.put("/posts/:id", updatePost);
router.delete("/posts/:id", deletePost);

// Users
router.get("/users", getAllUsers);
router.put("/users/:id/block", blockUser);
router.put("/users/:id/unblock", unblockUser);
router.delete("/users/:id", deleteUser);

// Comments
router.get("/comments", getAllComments);
router.delete("/posts/:postId/comments/:commentId", deleteComment);

module.exports = router;
