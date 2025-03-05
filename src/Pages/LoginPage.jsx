import React, { useState, useEffect, useRef } from "react";
import { defaultPosts } from "./data";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const dis2 = defaultPosts.slice(0, 7);
  const [currentBlogs, setCurrentBlogs] = useState([dis2[0]]);
  const navigate = useNavigate();
  const blogRef = useRef(null);

  const handleLogin = (event) => {
    event.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (user) => user.username.trim() === username.trim() && user.password === password
    );

    if (user) {
      localStorage.setItem("isLoggedIn", JSON.stringify(user));
      setTimeout(() => {
        window.dispatchEvent(new Event("storage"));
      }, 1000);

      setMessage("Login successful!");
      setTimeout(() => {
        navigate("/Home");
      }, 1000);
    } else {
      setMessage("Invalid username or password.");
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






