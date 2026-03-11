import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LogOut, Search } from "lucide-react";
import "./Header.css";
import { Link as ScrollLink } from "react-scroll";

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("isLoggedIn")));
  const [searchValue, setSearchValue] = useState("");
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
    window.dispatchEvent(new CustomEvent("showSuccessToast", { detail: { message: "Logged Out Successfully" } }));
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

  const handleSearch = (e) => {
    e?.preventDefault?.();
    const query = searchValue.trim();
    if (query) {
      navigate(`/category/${query}`);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getAvatarSrc = (avatar) => {
    if (!avatar) return "/default.jpg";
    const trimmed = String(avatar).trim();
    if (!trimmed || trimmed === "null" || trimmed === "undefined") return "/default.jpg";
    return trimmed;
  };

  return (
    <header className={`header ${isNavbarHidden ? "hidden" : ""}`}>
      <div className="header-inner">
        <div className="logo-container">
          <Link to="/home">
            <img src="Quip.png" alt="Logo" className="logo" />
          </Link>
        </div>

        <form className="search-wrapper" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="What are you looking for?"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="search-input"
          />
          <button type="submit" className="search-btn" aria-label="Search">
            <Search size={18} />
          </button>
        </form>

        <nav className="nav-links">
          <Link to="/contact">Contact Us</Link>
          <ScrollLink to="about" smooth={true} duration={500}>
            About Us
          </ScrollLink>
        </nav>

        <div className="auth-container">
          {user ? (
            <>
              <Link to="/create" className="new-post">New Post</Link>
              <Link to="/profile" className="profile-link">
                <img
                  src={getAvatarSrc(user.avatar)}
                  alt="User Avatar"
                  className="header-avatar"
                  onError={(e) => {
                    e.currentTarget.src = "/default.jpg";
                  }}
                />
              </Link>
              <button onClick={handleLogout} className="auth-button logout">
                <LogOut size={13} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="auth-button auth-link">Sign Up</Link>
              <Link to="/login-page" className="auth-button auth-btn">Log In</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
