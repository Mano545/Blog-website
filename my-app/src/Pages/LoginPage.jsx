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
      const response = await fetch("http://localhost:4008/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("isLoggedIn", JSON.stringify(data.user));
        localStorage.setItem("token", data.token); // Store Token
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
    </div>
  );
}






