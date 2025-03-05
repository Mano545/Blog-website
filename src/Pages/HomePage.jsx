import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { usePosts } from "./PostContext";
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";
import { FacebookIcon, TwitterIcon, WhatsappIcon } from "react-share";
import "./HomePage.css";

export default function HomePage() {
  const { posts } = usePosts();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem("isLoggedIn")));
  }, []);

  const handlePostClick = (e, postId) => {
    e.preventDefault();
    if (isLoggedIn) {
      navigate(`/post/${postId}`);
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className="container">
      <div className="hero-banner">
        <img src="banner.webp" alt="Blogging Banner" className="hero-image" />
        <div className="hero-content">
          <h1>Share your story with the world.</h1>
          <p>
            Create a beautiful, personalized blog that fits your brand. Grow your
            audience with built-in marketing tools, or transform your passion into
            revenue by gating access with a paywall.
          </p>
          <Link to="/register" className="get-started-btn">
            Get Started
          </Link>
        </div>
      </div>

      <div className="blog-heading">BLOG</div>

      <div className="posts-grid">
        {posts
        .map((post)=>{
          const postUrl = `${window.location.origin}/post/${post._id}`;
          return (
            <div className="post-card" key={post._id}>
              <div className="ff">
                <Link to={`/post/${post._id}`} onClick={(e) => handlePostClick(e, post._id)}>
                  <img src={post.cover} alt={post.title} className="post-image" />
                </Link>
              </div>
              <div className="post-content">
                <span className="post-date">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
                <Link to={`/post/${post._id}`} onClick={(e) => handlePostClick(e, post._id)} className="post-title">
                  <h2>{post.title}</h2>
                </Link>
                <p className="post-summary">{post.summary}</p>
                
                <div className="share-buttons">
                  <FacebookShareButton url={postUrl} quote={post.title}>
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                  <TwitterShareButton url={postUrl} title={post.title}>
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>
                  <WhatsappShareButton url={postUrl} title={post.title}>
                    <WhatsappIcon size={32} round />
                  </WhatsappShareButton>
                </div>

                <Link 
                  to={`/post/${post._id}`} 
                  onClick={(e) => handlePostClick(e, post._id)}
                  className="read-more"
                >
                  Read More
                </Link>
              </div>
            </div>
          );
        })}
      </div>
           {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowModal(false)}>✖</button>
            <h2>Register to Access</h2>
            <p>You need to be registered to view this post.</p>
            <Link to="/register" className="modal-button">Register</Link>
          </div>
        </div>
      )}
    </div>
  );
}
