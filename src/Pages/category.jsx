// CategoryPage.js
import { Link, useNavigate, useParams } from "react-router-dom";
import { usePosts } from "./PostContext";
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";
import { FacebookIcon, TwitterIcon, WhatsappIcon } from "react-share";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import "./HomePage.css";

export default function CategoryPage() {
  const navigate = useNavigate();
  const { category } = useParams();
  const { posts } = usePosts();

  const filteredPosts = posts.filter(
    (post) => post.categary.toLowerCase() === category.toLowerCase()
  );
  const handlePostClick = (e,p)=>{
    e.preventDefault();
  navigate(`/post/${p}`);
  }

  return (
    <div className="container">
      <h1>Posts in "{category}"</h1>
      <div className="posts-grid">
        {filteredPosts.length ? (
          filteredPosts.map((post) => {
            const postUrl = `${window.location.origin}/post/${post._id}`;
            return (
              <div className="post-card" key={post._id}>
                <div className="ff">
                  <img src={`/${post.cover}`} alt={post.title} className="post-image" />
                </div>
                <div className="post-content">
                  <span className="post-date">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  <h2>{post.title}</h2>
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
                  <Link className="read-more" onClick={(e)=>handlePostClick(e,post._id)}>Read More</Link>
                </div>
              </div>
            );
          })
        ) : (
          <p>No posts found in this category.</p>
        )}
      </div>
    </div>
  );
}

