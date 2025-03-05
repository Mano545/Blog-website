import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { usePosts } from "./PostContext";
import "./EditPost.css";

export default function EditPost() {
  const { id } = useParams();
  const { posts, updatePost } = usePosts(); 
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const post = posts.find((p) => p._id === id);
    if (post) {
      setTitle(post.title);
      setSummary(post.summary);
      setContent(post.content);
      setCoverImage(post.cover);
    }
  }, [id, posts]);

  const handleUpdate = (ev) => {
    ev.preventDefault();

    updatePost(id, {
      title,
      summary,
      content,
      cover: coverImage,
    });

    setRedirect(true);
  };

  if (redirect) {
    return <Navigate to={`/post/${id}`} />;
  }

  return (
    <form onSubmit={handleUpdate} className="edit-post" style={{ marginTop: "120px" }}>
      <h1>Edit post</h1>
      {coverImage && <img src={`/${coverImage}`} alt="Cover" style={{ maxWidth: "100%", maxHeight: "300px", marginBottom: "10px" }} />}
      <input type="text" placeholder="Title" value={title} onChange={(ev) => setTitle(ev.target.value)} />
      <input type="text" placeholder="Summary" value={summary} onChange={(ev) => setSummary(ev.target.value)} />
      <input type="text" placeholder="Image URL" value={coverImage} onChange={(ev) => setCoverImage(ev.target.value)} />
      <textarea placeholder="Content" value={content} onChange={(ev) => setContent(ev.target.value)} />
      <button style={{ marginTop: "5px" }}>Update post</button>
    </form>
  );
}
