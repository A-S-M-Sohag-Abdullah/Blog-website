import axios from "axios";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function AdminBlog({ id,deleteBlogId, setDeleteBlogId, setShowPopup }) {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState("");

  const handleView = () => {
    //console.log('view');
    navigate(`/blogs/${id}`);
  };

  const handleEdit = () => {
    navigate(`/editblog/${id}`);
  };

  const handleDelete = () => {
    setDeleteBlogId(id);
    setShowPopup(true);
  }

  useEffect(() => {
    (async () => {
      const blog = await axios.get(`http://localhost:8000/blog/${id}`);
      //console.log(blog.data);
      setCoverImage(blog.data.coverImage);
      setTitle(blog.data.title);
    })();
  }, [id]);
  return (
    <div className="col-12">
      <div className="admin-blog-box d-flex align-items-center">
        <img
          src={`http://localhost:8000/images/${coverImage.imageurl}`}
          alt=""
          className="admin-blog-img"
        />
        <h4 className="ms-4 admin-blog-title mb-0">{title}</h4>

        <div className="options ms-auto">
          <button onClick={handleView}>
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button onClick={handleEdit} className="mx-2">
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button onClick={handleDelete}>
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </div>
      </div>
      
    </div>
  );
}

export default AdminBlog;
