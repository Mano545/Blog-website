import { createContext, useContext, useEffect, useState } from "react";

const PostContext = createContext();

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:4008/posts");
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
      const response = await fetch("http://localhost:4008/create-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });

      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const deletePost = async (id) => {
    try {
      const response = await fetch(`http://localhost:4008/posts/${id}`, {
        method: "DELETE",
      });

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
      const response = await fetch(`http://localhost:4008/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

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

  return (
    <PostContext.Provider value={{ posts, addPost, deletePost, updatePost }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePosts() {
  return useContext(PostContext);
}
