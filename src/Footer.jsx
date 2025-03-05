import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <img src="Quip.png" alt="logo" className="logo" />
        <p>
        Life’s too short for boring blogs! Here, we serve up fresh, witty, and thought-provoking takes on everything from tech trends to travel tales. Whether you’re here for inspiration, information, or just a good laugh, we’ve got something for you. So, grab a coffee, get comfy, and let’s dive in!
        </p>
      </div>

      <div className="footer-container">
        <div className="footer-section">
          <h3>Information</h3>
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/menu">Contact us</Link>
        </div>

        <div className="footer-section">
          <h3>Useful Links</h3>
          <Link to="/contact">Services</Link>
          <Link to="/privacy">Privacy Terms</Link>
          <Link to="/help">Help & Support</Link>
          <Link to="/terms">Terms & Conditions</Link>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <p><FaEnvelope /> info@Blog.com</p>
          <p><FaPhone /> 910 468 587 1235</p>
          <p><FaMapMarkerAlt /> Coimbatore, India</p>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /> Linkedin</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter />Twitter</a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /> Facebook</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /> Instagram</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 QuipBlog.com - All Rights Reserved.</p>
      </div>
    </footer>
  );
}
