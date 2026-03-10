import React, { useState } from "react";
import "./Signup.css";
import Swal from "sweetalert2";


export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:4008/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Registered successfully!",
          showConfirmButton: false,
          timer: 1200,
        });
        setUsername("");
        setPassword("");
        setTimeout(() => window.location.href = "/login-page", 1200);
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: data.message || "Username already taken or invalid input",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "warning",
        title: "Server Error",
        text: "Registration service is currently unavailable.",
        confirmButtonText: "OK",
      });
    }
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
