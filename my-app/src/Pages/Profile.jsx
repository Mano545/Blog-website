import { useEffect, useState } from "react";
import "./Profile.css";
import { usePosts } from "./PostContext";
import Swal from "sweetalert2";

export default function Profile() {
  const [user, setUser] = useState(null);
  const { posts } = usePosts();
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    avatar: "",
    bio: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("isLoggedIn"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const loggedInUser = user?.username;

  const userPosts = posts.filter(
    (p) =>
      p.author?.username === loggedInUser || p.author === loggedInUser
  );


  

const handleEditProfile = () => {
  setFormData({
    username: user.username,
    name: user.name,
    avatar: user.avatar || "",
    bio: user.bio || "",
  });

  Swal.fire({
    title: "Edit Profile",
    html: `
      <input id="name" class="swal2-input" placeholder="Name" value="${user.name}" />
      <input id="avatar" class="swal2-input" placeholder="Avatar URL" value="${user.avatar || ""}" />
      <input id="bio" class="swal2-input" placeholder="Bio" value="${user.bio || ""}" />
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Save",
    preConfirm: () => {
      const name = document.getElementById("name").value;
      const avatar = document.getElementById("avatar").value;
      const bio = document.getElementById("bio").value;
      return { name, avatar, bio };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const updatedUser = {
        ...user,
        name: result.value.name,
        avatar: result.value.avatar,
        bio: result.value.bio,
      };

      localStorage.setItem("isLoggedIn", JSON.stringify(updatedUser));

      const allUsers = JSON.parse(localStorage.getItem("users")) || [];
      const updatedUsers = allUsers.map((u) =>
        u.username === user.username ? updatedUser : u
      );

      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setUser(updatedUser);

      Swal.fire("Saved!", "Your profile has been updated.", "success");
    }
  });
};
  
  return (
    <div className="profile-page">
      {user ? (
        <div className="profile-layout">
          <div className="blogs-section">
            <h3>Blogs Published</h3>
            {userPosts.length > 0 ? (
              userPosts.map((blog) => (
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
              src={user.avatar || "/default-avatar.png"}
              alt="User Avatar"
              className="profile-avatar"
            />
            <h2>@{user.username}</h2>
            <p>{user.name}</p>
            <p className="joined-date">Bio:</p>
            <p>{user.bio}</p>
            <button
              className="edit-profile-button"
              onClick={handleEditProfile}
            >
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
                <label>
                  Bio:
                  <input
                    type="text"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                  />
                </label>
                <div className="form-actions">
                  <button className="fof" onClick={handleSaveProfile}>
                    Save
                  </button>
                  <button className="fof" onClick={() => setShowEditForm(false)}>
                    Cancel
                  </button>
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
