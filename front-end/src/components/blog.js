import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Blog() {
  const [active, setActive] = useState(false);
  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [descriptions, setDescriptions] = useState([{ description: "" }]);

  const params = useParams();

  useEffect(() => {
    (async () => {
      const blog = await axios.get(`http://localhost:8000/blog/${params.id}`);
      //console.log(blog.data);
      setActive(blog.data.active);
      setCoverImage(blog.data.coverImage);
      setTitle(blog.data.title);
      setDescriptions(blog.data.descriptions);
    })();
  }, []);

  if (!active) return <h1>Content not avaialable</h1>;

  return (
    <div className="blog col-9">
      {coverImage && (
        <img
          className="w-100"
          style={{ height: "400px" }}
          src={`http://localhost:8000/images/${coverImage.imageurl}`}
          alt=""
        />
      )}
      {coverImage && <p className="image-name">{coverImage.imageTitle}</p>}
      <h1 className="blog-title py-4">{title}</h1>
      {descriptions &&
        descriptions.map((item, index) => (
          <div className="description-box" key={item._id}>
            {index === 0 &&
              item.description &&
              item.description
                .split("\n")
                .map((line, idx) => <p key={idx}>{line}</p>)}

            <div className="description-media">
              <div className="description-image">
                {item.descriptionImage && (
                  <img
                    className="w-100"
                    src={`http://localhost:8000/images/${item.descriptionImage.imageurl}`}
                  />
                )}

                {item.descriptionImage && (
                  <p className="image-name">
                    {item.descriptionImage.imageTitle}
                  </p>
                )}
              </div>

              <div className="description-video">
                {item.videoUrl && (
                  <iframe
                    width="560"
                    height="315"
                    src={item.videoUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                )}
              </div>
            </div>

            {index !== 0 &&
              item.description &&
              item.description
                .split("\n")
                .map((line, idx) => <p key={idx}>{line}</p>)}
          </div>
        ))}
    </div>
  );
}

export default Blog;
