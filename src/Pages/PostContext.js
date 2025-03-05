import { createContext, useContext, useState } from "react"; 
import { defaultPosts } from "./data";

const PostContext = createContext();

export function PostProvider({ children }) {
  const [posts, setPosts] = useState(defaultPosts);

  const addPost = (newPost) => {
    setPosts((prevPosts) => [...prevPosts, newPost]);
  };

  const deletePost = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  const updatePost = (postId, updatedData) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post._id === postId ? { ...post, ...updatedData } : post))
    );
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
