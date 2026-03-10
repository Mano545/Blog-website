import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { LogOut, TextCursorIcon } from 'lucide-react';
import "./Header.css";
import { Link as ScrollLink } from "react-scroll"

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("isLoggedIn")));
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);

  useEffect(() => {
    const handleAuthChange = () => {
      const loggedInUser = JSON.parse(localStorage.getItem("isLoggedIn"));
      setUser(loggedInUser);
      if (loggedInUser) {
        navigate("/home");
      }
    };

    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authChange"));
    setUser(null);
    navigate("/home");
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsNavbarHidden(scrollTop > lastScrollTop);
      setLastScrollTop(scrollTop);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  const handleCategorySearch = (e) => {
    if (e.key === "Enter") {
      const category = e.target.value.trim();
      if (category) {
        navigate(`/category/${category}`);
      }
    }
  };


  return (
    <header className={`header ${isNavbarHidden ? "hidden" : ""}`}>
      <div className="logo-container">
        <Link to="/home">
          <img src="Quip.png" alt="Logo" className="logo" />
        </Link>
      </div>
      <nav className="nav-links">
        <Link to="/contact">Contact Us</Link>
        <ScrollLink to="about" smooth={true} duration={500}>About Us</ScrollLink>
        <div className="search-container">
          <input type="text" placeholder="Search by Collections" onKeyDown={handleCategorySearch} />
        </div>
      </nav>

      <div className="auth-container">
        {user ? (
          <>
            <Link to="/create" className="new-post">New Post</Link>
            <Link to="/profile" className="profile-link">
              {user.avatar ? (
                <img src={user.avatar} alt="User Avatar" className="header-avatar" />
              ) : (
                <CgProfile className="big-profile-icon" />
              )}
            </Link>
            <button onClick={handleLogout} className="auth-button logout"><LogOut size={13} className="auth-button.logout" /> Logout</button>
          </>
        ) : (
          <>
            <Link to="/login-page" className="auth-button">Login</Link>
            <Link to="/register" className="auth-button">Register</Link>
          </>
        )}
      </div>
    </header>
  );
}
