import axios from "axios";
import React, { useEffect, useState } from "react";

function Blogs() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    (async () => {
      const blog = await axios.get("http://localhost:8000/blog");
      setBlogs(blog.data);
    })();
  }, []);

  return (
    <div className="container">
      <div className="row g-1">
      {blogs.map((item, index) => {
        return (
          
            <div className="col-lg-4 col-6" key={item._id}>
              <div className="blog-box">
                <div className="">
                  <img
                    src={`http://localhost:8000/images/${item.coverImage.imageurl}` } className="w-100"
                    alt=""
                  />
                </div>
                <h4>{item.title}</h4>
                <p>{item.descriptions[0].description.substring(0, 70)}....</p>
                <p>{item.date}</p>
              </div>
            </div>
         
        );
      })}
       </div>
    </div>
  );
}

export default Blogs;
