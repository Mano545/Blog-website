import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const API_BASE = "http://localhost:4008/admin";

function getAdminToken() {
  return localStorage.getItem("adminToken");
}

function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getAdminToken()}`,
  };
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [editingPost, setEditingPost] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    category: "",
    cover: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!getAdminToken()) {
      setMessage("Access Denied");
      return;
    }
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    if (!getAdminToken()) return;
    try {
      if (activeTab === "posts") {
        const res = await fetch(`${API_BASE}/posts`, { headers: getAuthHeaders() });
        if (res.status === 403) {
          setMessage("Access Denied");
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");
          return;
        }
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      } else if (activeTab === "users") {
        const res = await fetch(`${API_BASE}/users`, { headers: getAuthHeaders() });
        if (res.status === 403) {
          setMessage("Access Denied");
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");
          return;
        }
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } else if (activeTab === "comments") {
        const res = await fetch(`${API_BASE}/comments`, { headers: getAuthHeaders() });
        if (res.status === 403) {
          setMessage("Access Denied");
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");
          return;
        }
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      }
      setMessage("");
    } catch {
      setMessage("Access Denied");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin-login");
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/posts`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setShowCreateForm(false);
        setFormData({ title: "", summary: "", content: "", category: "", cover: "" });
        fetchData();
      } else {
        setMessage(data.message || "Failed to create post");
      }
    } catch {
      setMessage("Failed to create post");
    }
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    if (!editingPost) return;
    try {
      const res = await fetch(`${API_BASE}/posts/${editingPost._id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setEditingPost(null);
        setFormData({ title: "", summary: "", content: "", category: "", cover: "" });
        fetchData();
      } else {
        setMessage(data.message || "Failed to update post");
      }
    } catch {
      setMessage("Failed to update post");
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      const res = await fetch(`${API_BASE}/posts/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) fetchData();
    } catch {
      setMessage("Failed to delete post");
    }
  };

  const handleBlockUser = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/users/${id}/block`, {
        method: "PUT",
        headers: getAuthHeaders(),
      });
      if (res.ok) fetchData();
    } catch {
      setMessage("Failed to block user");
    }
  };

  const handleUnblockUser = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/users/${id}/unblock`, {
        method: "PUT",
        headers: getAuthHeaders(),
      });
      if (res.ok) fetchData();
    } catch {
      setMessage("Failed to unblock user");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) fetchData();
    } catch {
      setMessage("Failed to delete user");
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      const res = await fetch(`${API_BASE}/posts/${postId}/comments/${commentId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) fetchData();
    } catch {
      setMessage("Failed to delete comment");
    }
  };

  const startEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || "",
      summary: post.summary || "",
      content: post.content || "",
      category: post.category || "",
      cover: post.cover || "",
    });
  };

  if (!getAdminToken()) {
    return (
      <div className="admin-dashboard admin-dark">
        <div className="admin-access-denied">Access Denied</div>
        <button
          className="admin-btn-primary"
          onClick={() => navigate("/admin-login")}
        >
          Go to Admin Login
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard admin-dark">
      <header className="admin-header">
        <div className="admin-logo-container">
          <img src="/white.png" alt="Logo" className="admin-logo" />
          <span className="admin-logo-text"></span>
        </div>
      </header>

      <div className="admin-layout">
        <nav className="admin-sidebar">
          <button
            className={`admin-nav-item ${activeTab === "posts" ? "active" : ""}`}
            onClick={() => setActiveTab("posts")}
          >
            Posts
          </button>
          <button
            className={`admin-nav-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            className={`admin-nav-item ${activeTab === "comments" ? "active" : ""}`}
            onClick={() => setActiveTab("comments")}
          >
            Comments
          </button>
          <button
            className="admin-nav-item admin-logout-nav"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>

        <main className="admin-main">
          {message && <div className="admin-message">{message}</div>}

          <div className="admin-content">
        {activeTab === "posts" && (
          <div className="admin-section">
            <div className="section-header">
              <h2>All Blog Posts</h2>
              <button
                className="btn-primary"
                onClick={() => {
                  setShowCreateForm(true);
                  setEditingPost(null);
                  setFormData({ title: "", summary: "", content: "", category: "", cover: "" });
                }}
              >
                Create Post
              </button>
            </div>

            {showCreateForm && (
              <form onSubmit={handleCreatePost} className="admin-form">
                <h3>Create New Post</h3>
                <input
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <input
                  placeholder="Summary"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                />
                <textarea
                  placeholder="Content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                />
                <input
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
                <input
                  placeholder="Cover Image URL"
                  value={formData.cover}
                  onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                />
                <div className="form-actions">
                  <button type="submit">Create</button>
                  <button type="button" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {editingPost && (
              <form onSubmit={handleUpdatePost} className="admin-form">
                <h3>Edit Post</h3>
                <input
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <input
                  placeholder="Summary"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                />
                <textarea
                  placeholder="Content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                />
                <input
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
                <input
                  placeholder="Cover Image URL"
                  value={formData.cover}
                  onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                />
                <div className="form-actions">
                  <button type="submit">Update</button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPost(null);
                      setFormData({ title: "", summary: "", content: "", category: "", cover: "" });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="posts-list">
              {posts.map((post) => (
                <div key={post._id} className="admin-card">
                  <h4>{post.title}</h4>
                  <p className="card-meta">By {post.author} · {post.category}</p>
                  <div className="card-actions">
                    <button onClick={() => startEdit(post)}>Edit</button>
                    <button
                      className="btn-danger"
                      onClick={() => handleDeletePost(post._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {posts.length === 0 && <p>No posts yet.</p>}
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="admin-section">
            <h2>All Users</h2>
            <div className="users-list">
              {users.map((user) => (
                <div key={user._id} className="admin-card">
                  <h4>{user.username}</h4>
                  <p className="card-meta">
                    Role: {user.role || "USER"} · {user.isBlocked ? "Blocked" : "Active"}
                  </p>
                  {user.role !== "ADMIN" && (
                    <div className="card-actions">
                      {user.isBlocked ? (
                        <button onClick={() => handleUnblockUser(user._id)}>
                          Unblock
                        </button>
                      ) : (
                        <button onClick={() => handleBlockUser(user._id)}>
                          Block
                        </button>
                      )}
                      <button
                        className="btn-danger"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {users.length === 0 && <p>No users yet.</p>}
            </div>
          </div>
        )}

        {activeTab === "comments" && (
          <div className="admin-section">
            <h2>All Comments</h2>
            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment._id} className="admin-card">
                  <h4>{comment.author}</h4>
                  <p>{comment.content}</p>
                  <p className="card-meta">Post: {comment.postTitle}</p>
                  <div className="card-actions">
                    <button
                      className="btn-danger"
                      onClick={() => handleDeleteComment(comment.postId, comment._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {comments.length === 0 && <p>No comments yet.</p>}
            </div>
          </div>
        )}
          </div>
        </main>
      </div>
    </div>
  );
}
