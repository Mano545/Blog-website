import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Profile.css";
import { usePosts } from "./PostContext";
import Swal from "sweetalert2";

export default function Profile() {
  const [user, setUser] = useState(null);
  const { posts } = usePosts();

  useEffect(() => {
    const loadProfile = async () => {
      const storedUser = JSON.parse(localStorage.getItem("isLoggedIn"));
      if (storedUser) setUser(storedUser);

      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:4008/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const dbUser = await res.json();
        localStorage.setItem("isLoggedIn", JSON.stringify(dbUser));
        setUser(dbUser);
      } catch {
        // ignore, keep local user
      }
    };

    loadProfile();
  }, []);

  const loggedInUsername = user?.username;

  const userPosts = useMemo(() => {
    if (!loggedInUsername) return [];
    return posts.filter(
      (p) => p.author?.username === loggedInUsername || p.author === loggedInUsername
    );
  }, [posts, loggedInUsername]);

  const email = user?.email || (user?.username ? `${user.username}@blogapp.com` : "");
  const bio = user?.bio || "No bio added yet.";

  const getAvatarSrc = (avatar) => {
    if (!avatar) return "/default.jpg";
    const trimmed = String(avatar).trim();
    if (!trimmed || trimmed === "null" || trimmed === "undefined") return "/default.jpg";
    return trimmed;
  };

  const handleEditProfile = () => {
    if (!user) return;

    Swal.fire({
      title: "Edit Profile",
      html: `
        <input id="avatar" class="swal2-input" placeholder="Avatar URL" value="${user.avatar || ""}" />
        <input id="email" class="swal2-input" placeholder="Email" value="${user.email || ""}" />
        <input id="bio" class="swal2-input" placeholder="Bio" value="${user.bio || ""}" />
        <textarea id="about" class="swal2-textarea" placeholder="About">${user.about || ""}</textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Save",
      preConfirm: () => {
        const avatar = document.getElementById("avatar").value;
        const email = document.getElementById("email").value;
        const bio = document.getElementById("bio").value;
        const about = document.getElementById("about").value;
        return { avatar, email, bio, about };
      },
    }).then((result) => {
      if (!result.isConfirmed) return;
      const token = localStorage.getItem("token");
      if (!token) return;

      fetch("http://localhost:4008/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          avatar: result.value.avatar,
          email: result.value.email,
          bio: result.value.bio,
          about: result.value.about,
        }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Update failed");
          const updatedUser = data.user;
          localStorage.setItem("isLoggedIn", JSON.stringify(updatedUser));
          setUser(updatedUser);
          Swal.fire("Saved!", "Your profile has been updated.", "success");
        })
        .catch(() => {
          Swal.fire("Error", "Failed to update profile.", "error");
        });
    });
  };

  if (!user) {
    return (
      <div className="profile-page">
        <p>User not logged in.</p>
      </div>
    );
  }

  return (
    <div className="profile-page profile-v2">
      <div className="profile-grid">
        {/* Left profile card */}
        <aside className="profile-card">
          <div className="profile-avatar-wrap">
            <img
              src={getAvatarSrc(user.avatar)}
              alt="User Avatar"
              className="profile-avatar"
              onError={(e) => {
                e.currentTarget.src = "/default.jpg";
              }}
            />
          </div>

          <div className="profile-identity">
            <h2 className="profile-username">@{user.username}</h2>
            <p className="profile-email">{email}</p>
          </div>

          <div className="profile-section-block">
            <h3 className="profile-block-title">Bio</h3>
            <p className="profile-block-text">{bio}</p>
          </div>

          <div className="profile-section-block">
            <h3 className="profile-block-title">About</h3>
            <p className="profile-block-text">
              {user.about || "Tell others a little about yourself here."}
            </p>
          </div>

          <button className="edit-profile-button" onClick={handleEditProfile}>
            Edit Profile
          </button>
        </aside>

        {/* Right: user's blogs */}
        <section className="profile-posts">
          <div className="profile-posts-header">
            <h3>My Blogs</h3>
            <p className="profile-posts-sub">Your published posts appear here.</p>
          </div>

          <div className="profile-posts-grid">
            {userPosts.length > 0 ? (
              userPosts.map((blog) => (
                <Link key={blog._id} to={`/post/${blog._id}`} className="profile-post-card">
                  <div className="profile-post-cover">
                    <img
                      src={blog.cover || "default-cover.png"}
                      alt={blog.title}
                      loading="lazy"
                    />
                  </div>
                  <div className="profile-post-body">
                    <h4 className="profile-post-title">{blog.title}</h4>
                    {blog.summary && <p className="profile-post-summary">{blog.summary}</p>}
                  </div>
                </Link>
              ))
            ) : (
              <div className="profile-empty">
                <p>No blogs published yet.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
