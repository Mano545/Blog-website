import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import ErrorPopup from "../components/ErrorPopup";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorPopup, setErrorPopup] = useState(null);
  const navigate = useNavigate();

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
        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("authChange"));
        window.dispatchEvent(new CustomEvent("showSuccessToast", { detail: { message: "Log In Successfully" } }));
        setTimeout(() => navigate("/home"), 1200);
      } else {
        setErrorPopup({
          title: "Something went wrong?",
          message: data.message || "Invalid username or password.",
          duration: 1500,
        });
      }
    } catch (error) {
      setErrorPopup({
        title: "Something went wrong?",
        message: "The server is not responding. Please try again.",
        duration: 1500,
      });
    }
  };


  return (
    <div className="login-container">
      {errorPopup && (
        <ErrorPopup
          title={errorPopup.title}
          message={errorPopup.message}
          duration={errorPopup.duration}
          onClose={() => setErrorPopup(null)}
        />
      )}
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






