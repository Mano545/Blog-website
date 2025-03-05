import { Link, useParams, useNavigate } from "react-router-dom";
import React from "react";
import "./HomePage.css";
import { usePosts } from "./PostContext";

export default function PostPage() {
  const { id } = useParams();
  const { posts, deletePost } = usePosts();
  const navigate = useNavigate();

  console.log("Posts:", posts);
  console.log("Post ID from URL:", id);

  const post = posts.find((p) => String(p._id) === String(id));

  if (!post) {
    return <div className="error-message">Post not found</div>;
  }

  const loggedInUser = JSON.parse(localStorage.getItem("isLoggedIn"))?.username;

  const handleDelete = () => {
    deletePost(id);
    navigate("/Home");
  };

  return (
    <div className="post-page">
      <div className="post-meta">
        <span className="author">by @{post.author?.username || "Unknown"}</span>
        <span className="date">
          {post.createdAt
            ? new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Unknown Date"}
        </span>
      </div>
  
      <h1>{post.title}</h1>

      <div className="summary">
        <p>{post.summary || "No summary available"}</p>
      </div>  
      {post.cover && (
        <div className="image">
          <img src={`/${post.cover}`} alt={post.title} />
        </div>
      )}
      <div className="content">
        {post.content ? (
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        ) : (
          <p>No content available</p>
        )}
      </div>
  
      {loggedInUser === post.author?.username && (
        <div className="edit-options">
          <Link to={`/edit/${post._id}`}>
            <button className="edit-button">Edit Post</button>
          </Link>
          <button className="delete-button" onClick={handleDelete}>
            Delete Post
          </button>
        </div>
      )}
    </div>
  );
  
}
