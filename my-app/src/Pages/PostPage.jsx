import { Link, useParams, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./PostPage.css";
import Swal from "sweetalert2";
import { usePosts } from "./PostContext";

export default function PostPage() {
  const { id } = useParams();
  const { posts, deletePost, likePost, addComment } = usePosts();
  const navigate = useNavigate();

  const post = posts.find((p) => String(p._id) === String(id));

  if (!post) {
    return <div className="error-message">Post not found</div>;
  }

  const loggedInUser = JSON.parse(localStorage.getItem("isLoggedIn"))?.username;
  const [commentText, setCommentText] = useState("");

  const handleLike = () => {
    if (!loggedInUser) {
      Swal.fire("Error", "You must be logged in to like posts", "error");
      return;
    }
    likePost(post._id, loggedInUser);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!loggedInUser) {
      Swal.fire("Error", "You must be logged in to comment", "error");
      return;
    }
    if (!commentText.trim()) return;

    addComment(post._id, { username: loggedInUser, content: commentText });
    setCommentText("");
  };

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
        <div className="image" style={{ marginTop: 20 }}  >
          <img src={post.cover} alt={post.title} style={{ width: 400, height: 300, marginLeft: 150 }} />
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

      <div className="interaction-section" style={{ marginTop: "20px", borderTop: "1px solid #ddd", paddingTop: "20px" }}>
        <button onClick={handleLike} className="like-button" style={{
          background: post.likes?.includes(loggedInUser) ? "#e74c3c" : "#eee",
          color: post.likes?.includes(loggedInUser) ? "#fff" : "#333",
          border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer"
        }}>
          {post.likes?.includes(loggedInUser) ? "Unlike" : "Like"} ({post.likes?.length || 0})
        </button>

        <div className="comments-section" style={{ marginTop: "30px" }}>
          <h3>Comments ({post.comments?.length || 0})</h3>

          {loggedInUser && (
            <form onSubmit={handleCommentSubmit} style={{ marginBottom: "20px" }}>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "4px", border: "1px solid #ddd" }}
                rows="3"
              />
              <button type="submit" style={{ background: "#333", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer" }}>
                Add Comment
              </button>
            </form>
          )}

          <div className="comments-list">
            {post.comments?.map((comment, index) => (
              <div key={index} className="comment" style={{ background: "#f9f9f9", padding: "10px", marginBottom: "10px", borderRadius: "4px" }}>
                <div style={{ fontWeight: "bold", fontSize: "0.9em" }}>{comment.author} <span style={{ fontWeight: "normal", color: "#666", fontSize: "0.8em" }}>- {new Date(comment.createdAt).toLocaleDateString()}</span></div>
                <p style={{ margin: "5px 0 0 0" }}>{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
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