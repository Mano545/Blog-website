import { createContext, useContext, useEffect, useState } from "react";

const PostContext = createContext();

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await fetch("https://blog-website-aaxa.onrender.com/posts");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const addPost = async (post) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://blog-website-aaxa.onrender.com/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(post),
      });

      if (response.status === 401) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("authChange"));
        return;
      }
      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const deletePost = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://blog-website-aaxa.onrender.com/posts/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("authChange"));
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const updatePost = async (id, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://blog-website-aaxa.onrender.com/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedData),
      });

      if (response.status === 401) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("authChange"));
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      const updatedPost = await response.json();

      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === id ? updatedPost.post : post))
      );
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const likePost = async (id, username) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Optimistic update: add the like locally first
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id !== id) return post;
          const likes = Array.isArray(post.likes) ? post.likes : [];
          if (likes.includes(username)) return post; // prevent multiple likes
          return { ...post, likes: [...likes, username] };
        })
      );

      const response = await fetch(`https://blog-website-aaxa.onrender.com/posts/${id}/like`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({}),
      });

      if (response.status === 401) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("authChange"));
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to like post");
      }

      const updatedPost = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === id ? updatedPost : post))
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const addComment = async (id, commentData) => {
    try {
      const token = localStorage.getItem("token");
      // commentData has { username, content }. Backend ignores username, uses token.
      const response = await fetch(`https://blog-website-aaxa.onrender.com/posts/${id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ content: commentData.content }),
      });

      if (response.status === 401) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("authChange"));
        return;
      }
      if (!response.ok) throw new Error("Failed to add comment");

      const updatedPost = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === id ? updatedPost : post))
      );
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <PostContext.Provider value={{ posts, addPost, deletePost, updatePost, likePost, addComment }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePosts() {
  return useContext(PostContext);
}
