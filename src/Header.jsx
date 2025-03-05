import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LogOut } from 'lucide-react';
import { CgProfile } from "react-icons/cg";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("isLoggedIn")));
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("isLoggedIn")));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setUser(null);
    navigate("/Home");
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
      navigate(`/category/${e.target.value}`);
    }
  };

  return (
    <header className={`header ${isNavbarHidden ? "hidden" : ""}`}>
      <div className="logo-container">
        <Link to="/Home">
          <img src="Quip.png" alt="Logo" className="logo" />
        </Link>
      </div>
      <nav className="nav-links">
        <Link to="/contact">Contact Us</Link>
        <Link to="/about-us">About Us</Link>
        <div className="search-container">
        <input type="text" placeholder="Search by Category" onKeyDown={handleCategorySearch} />        </div>
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
            <button onClick={handleLogout} className="auth-button logout"><LogOut size={13} className="auth-button.logout"/> Logout</button>
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
