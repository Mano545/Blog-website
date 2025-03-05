import { Link } from "react-router-dom";
import React from "react";
import "./BlogPage.css";

const BlogHomepage = () => {
  return (
    <div className="container1">
      <div className="grid-container">
        <div className="text-section">
          <h1 className="headline">Create a New Blog</h1>
          <p className="description">
          Share your story with the world. Create a beautiful, personalized blog that fits your brand. Grow your audience with built-in marketing tools, or transform your passion into revenue by gating access with a paywall.
          </p>
          <Link
            to="/register"
            className="cta-button"
          >
            Get Started
          </Link>
        </div>
        <div className="image-section">
          <img
            src="https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg"
            alt="Cooking Visual"
            className="image"
          />
        </div>
      </div>

    
    </div>
    
  );
};

export default BlogHomepage;
