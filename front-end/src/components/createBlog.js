import axios from "axios";
import React, { useState } from "react";

function CreateBlog() {
  const [title, setTitle] = useState("");
  const [coverImageTitle, setCoverImageTitle] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [descriptions, setDescriptions] = useState([{ description: "" }]);
  const [descriptionImage, setDescriptionImage] = useState([]);

  const addProperty = (i, property) => {
    const newDescriptions = descriptions.map((item, itemIndex) => {
      if (i !== itemIndex) return item;
      else {
        item[property] = "";
        console.log(descriptions);
        return item;
      }
    });
    setDescriptions(newDescriptions);
  };

  const removeProperty = (i, property) => {
    const newDescriptions = descriptions.map((item, itemIndex) => {
      if (i !== itemIndex) return item;
      else {
        delete item[property];
        return item;
      }
    });
    setDescriptions(newDescriptions);
  };

  const handleDescriptionsChange = (value, i, fieldname) => {
    const newDescriptions = descriptions.map((item, itemIndex) => {
      if (i !== itemIndex) return item;
      else {
        item[fieldname] = value;
        //console.log(item);
        return item;
      }
    });
    setDescriptions(newDescriptions);
  };

  const handleDescriptionImage = (files) => {
    const newDescriptionImage = [...descriptionImage, files];
    setDescriptionImage(newDescriptionImage);
  };

  const handleBlogSubmit = async (e)=>{
    e.preventDefault();
   
    const formData = new FormData();
    formData.append('title', title);
    formData.append('coverImage[imageTitle]', coverImageTitle);
    formData.append('descriptions', descriptions);
    formData.append('coverImage', coverImage);
    formData.append('descriptionImage', descriptionImage);
    console.log(formData.entries());
    const data = await axios.post('http://localhost:8000/saveblog', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(data);
  }

  return (
    <div>
      <h1>Create a Blog Post</h1>
      <form
        onSubmit={(e) => {
          handleBlogSubmit(e);
        }}
        method="POST"
        encType="multipart/form-data"
      >
        {/* Blog Title */}
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          required
          value={title}
        />
        <br />
        <br />

        {/* Cover Image */}
        <label htmlFor="coverImageTitle">Cover Image Title:</label>
        <input
          type="text"
          id="coverImageTitle"
          name="coverImage[imageTitle]"
          onChange={(e) => {
            setCoverImageTitle(e.target.value);
          }}
          required
          value={coverImageTitle}
        />
        <br />
        <br />
        <label htmlFor="coverImage">Cover Image:</label>
        <input
          type="file"
          id="coverImageUrl"
          name="coverImage"
          onChange={(e) => {
            setCoverImage(e.target.files[0]);
          }}
          required
        />

        <br />
        <br />

        {descriptions.map((item, i) => {
          return (
            <div id="descriptions" key={i}>
              {i === 0 && (
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => {
                    handleDescriptionsChange(e.target.value, i, "description");
                  }}
                />
              )}
              <br />
              {i !== 0 && item.hasOwnProperty("description") && (
                <div>
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => {
                      handleDescriptionsChange(
                        e.target.value,
                        i,
                        "description"
                      );
                    }}
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeProperty(i, "description");
                    }}
                  >
                    Remove description
                  </button>
                </div>
              )}

              {i !== 0 && !item.hasOwnProperty("description") && (
                <div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addProperty(i, "description");
                    }}
                  >
                    add description
                  </button>
                </div>
              )}
              <br />

              {!item.hasOwnProperty("descriptionImage") && (
                <div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addProperty(i, "descriptionImage");
                    }}
                  >
                    add Image
                  </button>
                </div>
              )}

              {item.hasOwnProperty("descriptionImage") && (
                <div>
                  <input
                    type="file"
                    name="coverImage"
                    onChange={(e) => {
                      handleDescriptionImage(e.target.files);
                    }}
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeProperty(i, "descriptionImage");
                    }}
                  >
                    Remove Image
                  </button>
                </div>
              )}

              <br />

              {!item.hasOwnProperty("videoUrl") && (
                <div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addProperty(i, "videoUrl");
                    }}
                  >
                    add video
                  </button>
                </div>
              )}

              {item.hasOwnProperty("videoUrl") && (
                <div>
                  <input
                    type="text"
                    placeholder="videourl"
                    value={item.videoUrl}
                    onChange={(e) => {
                      handleDescriptionsChange(e.target.value, i, "videoUrl");
                    }}
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeProperty(i, "videoUrl");
                    }}
                  >
                    remove video
                  </button>
                </div>
              )}

              <br />
            </div>
          );
        })}

        {/* Submit Button */}
        <input type="submit" value="Create Blog Post" />
      </form>
    </div>
  );
}

export default CreateBlog;
