import React, { useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BlogContext } from "./adminPanel";
import PublicBlogContext from "../contexts/publicBlogContext";

function DeletePopup({ deleteBlogId, setDeleteBlogId, setShowPopup }) {
  const { getBlogs } = useContext(PublicBlogContext);
  const { blogs, setBlogs } = useContext(BlogContext);
  const navigate = useNavigate();
  const handleDeleteBlog = async () => {
    const deleted = await axios.post(
      `http://localhost:8000/deleteblog/${deleteBlogId}`
    );
    if (deleted) {
      console.log(blogs);
      setBlogs((prevItems) =>
        prevItems.filter((item) => item._id !== deleteBlogId)
      );
    }
    setShowPopup(false);
    setDeleteBlogId(null);
    getBlogs();
  };
  return (
    <div className="popup">
      <div className="popupInner">
        <h2>Are you sure you want to delete this?</h2>
        <button onClick={handleDeleteBlog}>Yes</button>
        <button
          onClick={() => {
            setDeleteBlogId(null);
            setShowPopup(false);
          }}
        >
          No
        </button>
      </div>
    </div>
  );
}

export default DeletePopup;
