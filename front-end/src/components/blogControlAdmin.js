import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import PublicBlogContext from "../contexts/publicBlogContext";
import SearchBox from "./searchBox";

function BlogControlAdmin() {
  const { getBlogs } = useContext(PublicBlogContext);
  const [blogs, setBlogs] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");

  const chageStatus = async (id, status) => {
    status = status ? false : true;

    const data = await axios.post(
      `http://localhost:8000/updateblogapproval/${id}`,
      {
        blogStatus: status,
      }
    );
    if (data.data) {
      const updatedblog = blogs.map((blog) =>
        blog._id === id ? { ...blog, active: status } : blog
      );
      setBlogs(updatedblog);
      getBlogs();
    }
  };

  useEffect(() => {
    (async () => {
      const blog = await axios.get(
        `http://localhost:8000/adminControl/blogs?title=${searchTitle}`
      );
      console.log(blog.data);
      setBlogs(blog.data);
    })();
  }, [searchTitle]);
  return (
    <>
      <SearchBox searchTerm={searchTitle} setSearchTerm={setSearchTitle} placeholder = "Search with Title"/>
      {blogs.map((blog) => {
        return (
          <div className="blog-container">
            <img
              src={`http://localhost:8000/images/${blog.coverImage.imageurl}`}
              alt="Blog Cover Image"
              className="blog-img"
            />
            <h4 className="blog-title">{blog.title}</h4>
            <p className="blog-status">
              <button
                className="status-button"
                onClick={() => {
                  chageStatus(blog._id, blog.active);
                }}
              >
                Change blog status
              </button>
              <span className="status">{blog.active ? "true" : "false"}</span>
            </p>
          </div>
        );
      })}
    </>
  );
}

export default BlogControlAdmin;
