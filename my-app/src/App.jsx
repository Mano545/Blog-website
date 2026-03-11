import './App.css';
import { Route, Routes, Navigate } from "react-router-dom";
import SuccessToastListener from "./components/SuccessToastListener";
import HomePage from './Pages/HomePage';
import { PostProvider } from "./Pages/PostContext";
import Layout from './Layout';
import Loginpage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import PostPage from './Pages/PostPage';
import CreatePostPage from './Pages/CreatePost';
import EditPost from './Pages/EditPost';
import BlogPage from './Pages/BlogPage';
import Profile from './Pages/Profile';
import Contact from './Pages/Contact';
import CategoryPage from './Pages/category';
import AdminLoginPage from './Pages/AdminLoginPage';
import AdminDashboard from './Pages/AdminDashboard';

function App() {
  return (
    <PostProvider>
      <SuccessToastListener />
      <Routes>
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<Navigate to="/admin-login" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/login-page" element={<Loginpage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/Blog" element={<BlogPage />} />
          <Route path="/Home" element={<HomePage />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/edit/:id" element={<EditPost />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/category/:category" element={<CategoryPage />} />
        </Route>
      </Routes>
    </PostProvider>
  );
}

export default App;
