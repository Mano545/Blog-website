/**
 * Data Structures - Admin Blog Application
 *
 * This file documents the basic class/structure definitions and storage.
 * Storage: MongoDB (via Mongoose). Models are in /models/.
 */

// --- USER ---
// Fields: username, password, role ('USER' | 'ADMIN'), isBlocked
// Methods: Register, Login, GetUsers, BlockUser, UnblockUser, DeleteUser

// --- POST ---
// Fields: title, summary, content, category, cover, author, likes[], comments[], createdAt
// Methods: GetPosts, CreatePost, UpdatePost, DeletePost

// --- COMMENT (embedded in Post) ---
// Fields: author, content, createdAt
// Methods: GetComments (from all posts), DeleteComment

// --- ADMIN OPERATIONS ---
// - adminLogin(username, password)
// - getAllPosts()
// - createPost(postData)
// - updatePost(id, postData)
// - deletePost(id)
// - getAllUsers()
// - blockUser(id)
// - unblockUser(id)
// - deleteUser(id)
// - getAllComments()
// - deleteComment(postId, commentId)
