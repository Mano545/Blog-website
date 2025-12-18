import { Link, useParams, useNavigate } from "react-router-dom";
import React from "react";
import "./PostPage.css";
import Swal from "sweetalert2";
import { usePosts } from "./PostContext";

export default function PostPage() {
  const { id } = useParams();
  const { posts, deletePost } = usePosts();
  const navigate = useNavigate();

  const post = posts.find((p) => String(p._id) === String(id));

  if (!post) {
    return <div className="error-message">Post not found</div>;
  }

  const loggedInUser = JSON.parse(localStorage.getItem("isLoggedIn"))?.username;

  const handleDelete = async () => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "Do you really want to delete this post?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  try {
    await deletePost(id);
    Swal.fire({
      title: "Deleted!",
      text: "Post deleted successfully!",
      icon: "success",
      confirmButtonText: "OK",
    });
    navigate("/Home");
  } catch (error) {
    console.error("Error deleting post:", error);
    Swal.fire({
      title: "Error",
      text: `Error deleting post: ${error.message}`,
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};

  return (
    <div className="post-page">
      <div className="post-meta">
        <span className="author">by @{post.author || "Unknown"}</span>
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
        <div className="image" style={{marginTop:20}}  >
          <img src={post.cover} alt={post.title} style={{width:400,height:300,marginLeft:150}} />
        </div>
      )}

      <div className="content">
        {post.content ? (
          <div
            className="formatted-content"
            dangerouslySetInnerHTML={{
              __html: post.content.replace(/\n/g, "<br />"),
            }}
          />
        ) : (
          <p>No content available</p>
        )}
      </div>

      {loggedInUser === post.author && (
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