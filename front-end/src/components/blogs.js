import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicBlogContext from "../contexts/publicBlogContext";

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

function Blogs() {
  const { blogs } = useContext(PublicBlogContext);
  const [techBlogs, setTechBlogs] = useState([]);
  const [healthBlogs, setHealthBlogs] = useState([]);
  const [finBlogs, setFinBlogs] = useState([]);
  const [eduBlogs, setEduBlogs] = useState([]);
  const [entBlogs, setEntBlogs] = useState([]);

  const navigate = useNavigate();

  const gotoBlog = (category, id) => {
    navigate(`/blogs/${category}/${id}`);
  };
  const gotoCategory = (category) => {
    navigate(`/blogs/${category}`);
  };
  useEffect(() => {
    setTechBlogs(blogs.filter((item) => item.category === "Technology"));
    setHealthBlogs(blogs.filter((item) => item.category === "Health"));
    setFinBlogs(blogs.filter((item) => item.category === "Finance"));
    setEduBlogs(blogs.filter((item) => item.category === "Education"));
    setEntBlogs(blogs.filter((item) => item.category === "Entertainment"));
  }, [blogs]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-8">
          {blogs.length > 0 && (
            <div
              className="blog-box latest-blog"
              onClick={() => {
                gotoBlog(blogs[0].category, blogs[0]._id);
              }}
              key={5555}
            >
              <div className="">
                <img
                  src={`http://localhost:8000/images/${blogs[0].coverImage.imageurl}`}
                  className="w-100"
                  alt=""
                />
              </div>
              <h4>{blogs[0].title}</h4>
              <p>{blogs[0].descriptions[0].description.substring(0, 70)}....</p>
              <p>{formatDateToBangla(new Date(blogs[0].date))}</p>
            </div>
          )}
        </div>
        <div className="col-lg-4">
          <h3>আরও পড়ুন ...</h3>
          <hr />
          {blogs.map((item, index) => {
            return (
              <div
                className={
                  index === 0
                    ? "d-none"
                    : index < 7
                    ? "side-bar-blogs d-flex"
                    : "d-none"
                }
                onClick={() => {
                  gotoBlog(item.category, item._id);
                }}
                key={index}
              >
                <img
                  src={`http://localhost:8000/images/${item.coverImage.imageurl}`}
                  alt=""
                  className="admin-blog-img"
                />
                <h4 className="ms-4 admin-blog-title mb-0">{item.title}</h4>
              </div>
            );
          })}
        </div>
      </div>

      <div className="row mt-4 g-1">
        <h2>প্রযুক্তি</h2>
        <hr />
        {techBlogs.map((item, index) => {
          if (index < 3)
            return (
              <div className="col-lg-4" key={item._id}>
                <div
                  className="blog-box"
                  onClick={() => {
                    gotoBlog(item.category, item._id);
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
      <button
        className="view-more-btn"
        onClick={() => {
          gotoCategory("Technology");
        }}
      >
        আরও দেখুন...{" "}
      </button>

      <div className="row mt-4 g-1">
        <h2>স্বাস্থ্য</h2>
        <hr />
        {healthBlogs.map((item, index) => {
          if (index < 3) {
            return (
              <div className="col-lg-4" key={item._id}>
                <div
                  className="blog-box"
                  onClick={() => {
                    gotoBlog(item.category, item._id);
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
          } else
            return <span className="d-none" key={`not-heath-${index}`}></span>;
        })}
      </div>
      <button
        className="view-more-btn"
        onClick={() => {
          gotoCategory("Health");
        }}
      >
        আরও দেখুন...{" "}
      </button>

      <div className="row mt-4 g-1">
        <h2>অর্থনীতি</h2>
        <hr />
        {finBlogs.map((item, index) => {
          if (index < 3) {
            return (
              <div className="col-lg-4" key={item._id}>
                <div
                  className="blog-box"
                  onClick={() => {
                    gotoBlog(item.category, item._id);
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
          } else
            return <span className="d-none" key={`not-Fin-${index}`}></span>;
        })}
      </div>
      <button
        className="view-more-btn"
        onClick={() => {
          gotoCategory("Finance");
        }}
      >
        আরও দেখুন...{" "}
      </button>

      <div className="row mt-4 g-1">
        <h2>শিক্ষা</h2>
        <hr />
        {eduBlogs.map((item, index) => {
          if (index < 3) {
            return (
              <div className="col-lg-4" key={item._id}>
                <div
                  className="blog-box"
                  onClick={() => {
                    gotoBlog(item.category, item._id);
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
          } else
            return <span className="d-none" key={`not-Fin-${index}`}></span>;
        })}
      </div>
      <button
        className="view-more-btn"
        onClick={() => {
          gotoCategory("Education");
        }}
      >
        আরও দেখুন...{" "}
      </button>

      <div className="row mt-4 g-1">
        <h2>বিনোদন</h2>
        <hr />
        {entBlogs.map((item, index) => {
          if (index < 3) {
            return (
              <div className="col-lg-4" key={item._id}>
                <div
                  className="blog-box"
                  onClick={() => {
                    gotoBlog(item.category, item._id);
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
          } else
            return <span className="d-none" key={`not-Fin-${index}`}></span>;
        })}
      </div>
      <button
        className="view-more-btn col-12"
        onClick={() => {
          gotoCategory("Entertainment");
        }}
      >
        আরও দেখুন...
      </button>
    </div>
  );
}

export default Blogs;
