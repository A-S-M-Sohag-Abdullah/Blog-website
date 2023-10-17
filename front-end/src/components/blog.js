import axios from "axios";
import React, { useEffect, useState } from "react";

function Blog() {
  const [coverImage, setCoverImage] = useState("");
  const [title, setTitle] = useState("");
  const [descriptions, setDescriptions] = useState([]);

  useEffect(() => {
    (async () => {
      const blog = await axios.get(
        "http://localhost:8000/blog/652d50923ee80e3cbea8bdaf"
      );
      console.log(blog.data);
      setCoverImage(blog.data.coverImage.imageurl);
      setTitle(blog.data.title);
      setDescriptions(blog.data.descriptions);
    })();
  },[]);

  return (
    <div>
      {coverImage && <img style={{ width: '50%' }} src={`http://localhost:8000/images/${coverImage}`} alt="" />}
      <h1 className="blog-title">{title}</h1>
      {descriptions && descriptions.map((element) => (
        <div key={element._id}>
          {element.descriptionImage.imageurl && <img style={{ width: '20%' }} src={`http://localhost:8000/images/${element.descriptionImage.imageurl}`} alt="" />}
          {element.videoUrl && (
            <iframe
              src={`http://localhost:8000/images${element.videoUrl}`}
              title="description"
            ></iframe>
          )}
          {element.description && <p className="desc">{element.description}</p>}
        </div>
      ))}
    </div>
  );
}

export default Blog;
