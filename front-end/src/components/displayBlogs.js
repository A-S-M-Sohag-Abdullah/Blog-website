import React, { useState } from "react";
import AdminBlog from "./adminBlog";
import DeletePopup from "./deletePopup";
function DisplayBlogs({ blogs }) {

  const [deleteBlogId, setDeleteBlogId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      {blogs.map((blog, index) => {
        return (
          <AdminBlog
            key={blog._id}
            id={blog._id}
            setDeleteBlogId={setDeleteBlogId}
            setShowPopup={setShowPopup}
          />
        );
      })}

      {showPopup && (
        <DeletePopup
          deleteBlogId={deleteBlogId}
          setDeleteBlogId={setDeleteBlogId}
          setShowPopup={setShowPopup}
        />
      )}
    </div>
  );
}

export default DisplayBlogs;
