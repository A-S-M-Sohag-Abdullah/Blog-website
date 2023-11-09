import axios from "axios";
import React, { useEffect, useState } from "react";

function Blog() {
  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [descriptions, setDescriptions] = useState([{ description: "" }]);

  useEffect(() => {
    (async () => {
      const blog = await axios.get(
        "http://localhost:8000/blog/6549e28f755b0126ed83e821"
      );
      console.log(blog.data);
      setCoverImage(blog.data.coverImage);
      setTitle(blog.data.title);
      setDescriptions(blog.data.descriptions);
    })();
  },[]);

  return (
    <div className="blog col-9">
      {coverImage && <img className="w-100" style={{ height: '400px' }} src={`http://localhost:8000/images/${coverImage.imageurl}`} alt="" />}
      {coverImage && <p className="image-name">{coverImage.imageTitle}</p>}
      <h1 className="blog-title py-4">{title}</h1>
      {descriptions && descriptions.map((item,index) => (
        <div className="description-box" key={item._id}>

          {index === 0 && item.description && <p className="descrtiption">{item.description}</p>}
          
          <div className="description-media">
            <div className="description-image">
              {item.descriptionImage && <img className="w-100" src={`http://localhost:8000/images/${item.descriptionImage.imageurl}`}/>}
              
              {item.descriptionImage && <p className="image-name">{item.descriptionImage.imageTitle}</p>}
            </div>
            
            {item.videoUrl && <a href={item.videoUrl} target="_blank">Click here to watch</a>}
          </div>

          {index !==0 && item.description && <p className="descrtiption">{item.description}</p>}
        </div>
      ))}
    </div>
  );
}

export default Blog;
