import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";
import { FacebookIcon, TwitterIcon, WhatsappIcon } from "react-share";
import "./HomePage.css";

export default function CategoryPage() {
  const navigate = useNavigate();
  const { category } = useParams();
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategoryPosts = async () => {
      try {
        const response = await fetch(`http://localhost:4008/posts/category/${category}`);
        if (!response.ok) {
          throw new Error("No posts found in this category.");
        }
        const data = await response.json();
        setFilteredPosts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryPosts();
  }, [category]);

  const handlePostClick = (e, postId) => {
    e.preventDefault();
    navigate(`/post/${postId}`);
  };

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container"> 
      <h1 style={{fontWeight:"bold",fontSize:"30px"}}>Posts in {category}</h1>
      <div className="posts-grid">
        {filteredPosts.length ? (
          filteredPosts.map((post) => {
            const postUrl = `${window.location.origin}/post/${post._id}`;
            return (
              <div className="post-card" key={post._id}>
                <div className="image-container">
                  <img src={post.cover} alt={post.title} className="post-image" />
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

                  <Link className="read-more" onClick={(e) => handlePostClick(e, post._id)}>
                    Read More
                  </Link>
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
