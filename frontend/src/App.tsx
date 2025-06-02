import { Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import GoogleCallback from "./components/GoogleCallback";
import Blog from "./pages/Blog";
import Chat from "./pages/Chat";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import CreatePostForm from "./components/CreatePostForm";
import EditPostForm from "./components/EditPostForm";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import BlogDetail from "./pages/BlogDetails";

function App() {
  return (
    <>
      <CssBaseline />
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/google/callback" element={<GoogleCallback />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/post/create" element={<CreatePostForm />} />
          <Route path="/posts/:id/edit" element={<EditPostForm />} />
          <Route path="/posts/:id" element={<BlogDetail />} />
        </Route>
      </Routes >
    </>
  );
}

export default App;
