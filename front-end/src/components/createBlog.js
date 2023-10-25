import axios from "axios";
import React, { useState } from "react";

function CreateBlog() {
  const [title, setTitle] = useState("");
  const [coverImageTitle, setCoverImageTitle] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [descriptions, setDescriptions] = useState([{ description: "" }]);
  const [descriptionImages, setDescriptionImages] = useState([]);

  const [descImgPosArr, setDescImgPosArr] = useState([]);

  const addProperty = (i, property) => {
    const newDescriptions = descriptions.map((item, itemIndex) => {
      if (i !== itemIndex) return item;
      else {
        item[property] = null;
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

  const handleDescriptionImageTitle = (value, i) => {
    const newDescriptions = descriptions.map((item, itemIndex) => {
      if (i !== itemIndex) return item;
      else {
        item.descriptionImage = {};
        item.descriptionImage["imageTitle"] = value;
        //console.log(item);
        return item;
      }
    });
    setDescriptions(newDescriptions);
  };

  const handleDescriptionImage = (files, i) => {
    if (files) {
      const newDescriptionImage = [...descriptionImages, files];
      setDescriptionImages(newDescriptionImage);
      if (descImgPosArr.indexOf(i) == -1)
        setDescImgPosArr([...descImgPosArr, i]);
    } else return;
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    console.log(descriptions);
    formData.append("title", title);
    formData.append("coverImage[imageTitle]", coverImageTitle);
    const myDescriptions = JSON.stringify(descriptions);
    formData.append("descriptions", myDescriptions);

    formData.append("descImgPosArr", descImgPosArr);

    formData.append("coverImage", coverImage);
    descriptionImages.forEach((image, i) => {
      formData.append(`descriptionImage`, image);
    });
    const data = await axios.post("http://localhost:8000/saveblog", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(data);
  };

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
                    type="text"
                    placeholder="Image title"
                    onChange={(e) => {
                      handleDescriptionImageTitle(e.target.value, i);
                    }}
                  />
                  <input
                    type="file"
                    name="coverImage"
                    onChange={(e) => {
                      handleDescriptionImage(e.target.files[0], i);
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

        {/* Add more section */}
        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              setDescriptions([...descriptions, {}]);
            }}
          >
            Add section
          </button>
        </div>
        {/* Submit Button */}
        <input type="submit" value="Create Blog Post" />
      </form>
    </div>
  );
}

export default CreateBlog;
