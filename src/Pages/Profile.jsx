import { useEffect, useState } from "react";
import "./Profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({ username: "", name: "", avatar: "" });

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("isLoggedIn"));
    const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    setUser(loggedInUser);
    setBlogs(storedPosts.filter(post => post.author.username === loggedInUser?.username));
  }, []);

  const handleEditProfile = () => {
    setFormData({
      username: user.username,
      name: user.name,
      avatar: user.avatar || "",
    });
    setShowEditForm(true);
  };

  const handleSaveProfile = () => {
    const updatedUser = { ...user, ...formData };
  
    localStorage.setItem("isLoggedIn", JSON.stringify(updatedUser));
  
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = allUsers.map((u) =>
      u.username === user.username ? updatedUser : u
    );
  
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  
    setUser(updatedUser);
    setShowEditForm(false);
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="profile-page">
      {user ? (
        <div className="profile-layout">
          <div className="blogs-section">
            <h3>Blogs Published</h3>
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <div key={blog._id} className="blog-card">
                  <div className="blog-content">
                    <h4>{blog.title}</h4>
                    <p>{blog.summary}</p>
                  </div>
                  <div className="blog-image">
                    <img src={blog.cover || "default-cover.png"} alt={blog.title} />
                  </div>
                </div>
              ))
            ) : (
              <p>No blogs published yet.</p>
            )}
          </div>

          <div className="profile-section">
            <img
              src={user.avatar || `/${"default-avatar.png"}`}
              alt="User Avatar"
              className="profile-avatar"
            />
            <h2>@{user.username}</h2>
            <p>{user.name}</p>
            <p className="joined-date">Joined on: {user.joinedDate}</p>
            <button className="edit-profile-button" onClick={handleEditProfile}>
              Edit Profile
            </button>
          </div>

          {showEditForm && (
            <div className="edit-profile-popup">
              <div className="edit-profile-form">
                <h3>Edit Profile</h3>
                <label>
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Avatar URL:
                  <input
                    type="text"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                  />
                </label>
                <div className="form-actions">
                  <button className="fof" onClick={handleSaveProfile}>Save</button>
                  <button className="fof"onClick={() => setShowEditForm(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>User not logged in.</p>
      )}
    </div>
  );
}
