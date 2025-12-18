import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import { usePosts } from "./PostContext";

export default function CreatePostPage() {
  const { addPost } = usePosts();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState("");
  const [category,setCategory] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem("isLoggedIn"))?.username;

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!loggedInUser) {
      setError("You need to log in to create a post.");
      return;
    }
  
    if (!title.trim() || !summary.trim() || !content.trim() || !cover.trim() || !category.trim()) {
      setError("All fields are required.");
      return;
    }
  
    const newPost = {
      title,
      summary,
      content,
      category,
      cover,
      author: loggedInUser,
    };
  
    await addPost(newPost);
    navigate("/Home");
  };
  

  return (
    <form onSubmit={handleSubmit} className="create-post" style={{ marginTop: "122px" }}>
      <h1>Create New Post</h1>
      
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        required
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Category of the post"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Cover Image URL"
        value={cover}
        onChange={(e) => setCover(e.target.value)}
        required
      />
      <button type="submit">Create Post</button>
    </form>
  );
}
