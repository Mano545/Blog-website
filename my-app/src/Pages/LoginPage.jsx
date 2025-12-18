import React, { useState, useEffect, useRef } from "react";
import { defaultPosts } from "./data";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const dis2 = defaultPosts.slice(0, 7);
  const [currentBlogs, setCurrentBlogs] = useState([dis2[0]]);
  const navigate = useNavigate();
  const blogRef = useRef(null);

const handleLogin = async (event) => {
  event.preventDefault();

  try {
    const response = await fetch("http://localhost:4008/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("isLoggedIn", JSON.stringify(data.user));
      window.dispatchEvent(new Event("authChange"));
      Swal.fire({
        icon: "success",
        title: "Login successful!",
        showConfirmButton: false,
        timer: 1200,
      });
      setTimeout(() => navigate("/home"), 1200);
    } else {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: data.message || "Invalid username or password",
        confirmButtonText: "Try Again",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "warning",
      title: "Server Error",
      text: "The server is not responding. You are seeing the actual interface with dummy User.",
      confirmButtonText: "OK",
    });
  }
};


  const nextBlog = () => {
    setCurrentBlogs((prev) => {
      const nextIndex = dis2.indexOf(prev[0]) + 1;
      if (nextIndex >= dis2.length) return [dis2[0]];
      return [dis2[nextIndex]];
    });
  };

  const prevBlog = () => {
    setCurrentBlogs((prev) => {
      const prevIndex = dis2.indexOf(prev[0]) - 1;
      if (prevIndex < 0) return [dis2[dis2.length - 1]];
      return [dis2[prevIndex]];
    });
  };

  useEffect(() => {
    const interval = setInterval(nextBlog, 3000);
    setTimeout(() => {
      setCurrentBlogs([dis2[0], dis2[1]]);
    }, 4000);
    return () => clearInterval(interval);
  },);

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          {message && <p className="login-message">{message}</p>}
        </form>
        <p>
          Don't have an account?{" "}
          <button onClick={() => navigate("/register")} className="signup-button">
            Sign Up
          </button>
        </p>
      </div>


      <div className="info-box">
        <h2 className="popular-title">Popular Blogs</h2>
        <div className="blog-slider">
          <button className="arrow arrow-left" onClick={prevBlog}>&#9664;</button>
          {currentBlogs.map((post) => (
            <div key={post._id} className="blog-card" ref={blogRef}>
              <img src={post.cover} alt={post.title} className="blog-cover" />
              <div className="blog-content">
                <h3>{post.title}</h3>
                <p className="blog-summary">{post.summary}</p>
                <p className="blog-author">By {post.author.username}</p>
              </div>
            </div>
          ))}
          <button className="arrow arrow-right" onClick={nextBlog}>&#9654;</button>
        </div>
        <div className="dots">
          {dis2.map((post, index) => (
            <span
              key={index}
              className={`dot ${currentBlogs[0]._id === post._id ? "active" : ""}`}
              onClick={() => setCurrentBlogs([post])}
            />
          ))}
        </div>
      </div>
    </div>
  );
}






