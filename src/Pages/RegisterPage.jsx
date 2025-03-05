import React, { useState } from "react";
import "./Signup.css";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = (event) => {
    event.preventDefault();

    if (!username || !password) {
      setMessage("Please fill in both fields.");
      return;
    }

    const oldUsers = JSON.parse(localStorage.getItem("users")) || [];

    if (oldUsers.some((user) => user.username === username.trim())) {
      setMessage("Username already taken. Try another.");
      return;
    }

    const newUser = { username: username.trim(), password };
    const updatedUsers = [...oldUsers, newUser];

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setMessage("Registration successful! You can now log in.");
    setUsername("");
    setPassword("");
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <form className="register" onSubmit={handleRegister}>
          <h1>Register</h1>
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
          <button type="submit">Register</button>
          {message && <p className="register-message">{message}</p>}
          <div className="login-container1">
            <p>Already have an account?</p>
            <button className="login-button" onClick={() => window.location.href = "/login-page"}>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
