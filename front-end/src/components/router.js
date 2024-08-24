import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminPanel from "./adminPanel";
import CreateBlog from "./createBlog";
import Blogs from "./blogs";
import Blog from "./blog";
import Signup from "./signup";
import Login from "./login";
import AuthContext from "../contexts/authcontext";
import AddBlog from "./addBlog";
import CategoryBlogs from "./categoryBlogs";
import AdminAuthContext from "../contexts/adminauthContext";
import { AdminControl } from "./adminControl";
import BlogControlAdmin from "./blogControlAdmin";

function Router() {
  const { loggedIn } = useContext(AuthContext);
  const { adminLoggedIn } = useContext(AdminAuthContext);

  const AdminRoute = ({ element }) => {
    if (adminLoggedIn === true) return element;
    else if (adminLoggedIn === false) return <Navigate to="/login" />;
  };

  const ProtectedRoute = ({ element }) => {
    if (loggedIn === true) return element;
    else if (loggedIn === false) return <Navigate to="/login" />;
  };

  const PublicRoute = ({ element }) => {
    if (loggedIn === false) return element;
    else if (loggedIn === true) return <Navigate to="/blogs" />;
  };

  return (
    <div className="App container py-5">
      <Routes>
        {/* Admin routes */}
        <Route
          path="/admincontrol"
          element={<AdminRoute element={<AdminControl />} />}
        />
        <Route
          path="/adminblogcontrol"
          element={<AdminRoute element={<BlogControlAdmin />} />}
        />
        {/* Protected Routes */}
        <Route
          path="/admin"
          element={<ProtectedRoute element={<AdminPanel />} />}
        />
        <Route
          path="/addBlog"
          element={<ProtectedRoute element={<AddBlog />} />}
        />
        <Route
          path="/editblog/:id"
          element={<ProtectedRoute element={<CreateBlog />} />}
        />

        {/* Public Routes */}
        <Route path="/signup" element={<PublicRoute element={<Signup />} />} />
        <Route path="/login" element={<PublicRoute element={<Login />} />} />

        {/* Always Accessible Routes */}
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:category/:id" element={<Blog />} />
        <Route path="/blogs/:category" element={<CategoryBlogs />} />
        {/* Redirects */}
        <Route
          path="/*"
          element={<Navigate to={loggedIn ? "/blogs" : "/login"} />}
        />
      </Routes>
    </div>
  );
}

export default Router;
