import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import SuccessPopup from "../components/SuccessPopup";
import ErrorPopup from "../components/ErrorPopup";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorPopup, setErrorPopup] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:4008/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccess(true);
        setUsername("");
        setEmail("");
        setPassword("");
        setTimeout(() => navigate("/login-page"), 1200);
      } else {
        const isUsernameTaken = data.message?.toLowerCase().includes("username") && data.message?.toLowerCase().includes("taken");
        const isEmailTaken = data.message?.toLowerCase().includes("email");
        setErrorPopup({
          title: "Something went wrong?",
          message: isUsernameTaken
            ? "Username already exists. Please choose another username."
            : isEmailTaken
              ? "Email already in use. Please use a different email."
              : (data.message || "Registration failed. Please try again."),
          duration: 2000,
        });
      }
    } catch (error) {
      setErrorPopup({
        title: "Something went wrong?",
        message: "Registration service is currently unavailable. Please try again.",
        duration: 2000,
      });
    }
  };

  return (
    <div className="register-container">
      {showSuccess && (
        <SuccessPopup
          message="Account Created Successfully"
          onClose={() => setShowSuccess(false)}
        />
      )}
      {errorPopup && (
        <ErrorPopup
          title={errorPopup.title}
          message={errorPopup.message}
          duration={errorPopup.duration}
          onClose={() => setErrorPopup(null)}
        />
      )}
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
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
