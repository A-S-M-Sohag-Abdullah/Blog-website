import React, { useContext, useEffect, useState } from "react";
import PublicBlogContext from "../contexts/publicBlogContext";
import { useNavigate, useParams } from "react-router-dom";

function formatDateToBangla(date) {
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  };

  // Convert the date to Bangla format
  const formatter = new Intl.DateTimeFormat("bn-BD", options);
  return formatter.format(date);
}

function CategoryBlogs() {
  const [category, setCategory] = useState("");
  const { blogs } = useContext(PublicBlogContext);
  const [fileteredBlogs, setFilteredBlogs] = useState([]);
  const params = useParams();

  const navigate = useNavigate();

  const gotoBlog = (id) => {
    navigate(`/blogs/${category}/${id}`);
  };

  useEffect(() => {
    console.log("rendering");
    setCategory(params.category);
    setFilteredBlogs(blogs.filter((item) => item.category === params.category));
  }, [blogs]);

  if (fileteredBlogs.length == 0)
    return (
      <h1 className="text-center">No Blogs available for this category</h1>
    );
  else
    return (
      <div className="row">
        <h2>{category}</h2>
        <hr />
        {fileteredBlogs.map((item, index) => {
          return (
            <div className="col-lg-4" key={item._id}>
              <div
                className="blog-box"
                onClick={() => {
                  gotoBlog(item._id);
                }}
              >
                <div className="">
                  <img
                    src={`http://localhost:8000/images/${item.coverImage.imageurl}`}
                    className="w-100"
                    alt=""
                  />
                </div>
                <h4>{item.title}</h4>
                <p>{item.descriptions[0].description.substring(0, 70)}....</p>
                <p>{formatDateToBangla(new Date(item.date))}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
}

export default CategoryBlogs;
