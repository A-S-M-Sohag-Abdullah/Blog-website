import axios from "axios";
import React, { createContext, useState } from "react";
import Dragdrop from "./dragdrop";
import "bootstrap/dist/css/bootstrap.min.css";

const DragDropContext = createContext();

function CreateBlog() {
  const [title, setTitle] = useState("");
  const [coverImageTitle, setCoverImageTitle] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [descriptions, setDescriptions] = useState([{ description: "" }]);
  const [descriptionImages, setDescriptionImages] = useState([null]);

  const [descImgPosArr, setDescImgPosArr] = useState([]);

  const addProperty = (i, property) => {
    const newDescriptions = descriptions.map((item, itemIndex) => {
      if (i !== itemIndex) return item;
      else {
        item[property] = null;
        /* console.log(descriptions); */
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
      /* console.log("ekhane asce"); */
      /*  console.log(files);
      console.log(i); */

      if (descImgPosArr.indexOf(i) === -1) {
        const newDescriptionImage = descriptionImages.map((item, itemIndex) => {
          if (i !== itemIndex) return item;
          else {
            item = files;
            return item;
          }
        });

        setDescriptionImages(newDescriptionImage);
        setDescImgPosArr([...descImgPosArr, i]);
        console.log(descImgPosArr);
        /*   setDescImgPosArr(descImgPosArr.sort());
        console.log(descImgPosArr); */
      }else if(descImgPosArr.indexOf(i) >= -1){
        const newDescriptionImage = descriptionImages.map((item, itemIndex) => {
          if (i !== itemIndex) return item;
          else {
            item = files;
            return item;
          }
        });
        setDescriptionImages(newDescriptionImage);
      }
    } else return;
  };

  const removeDescriptionImage = (indextoRemove) =>{
    const filteredDescriptionImages = descriptionImages.map((item,index) => {
      if(index === indextoRemove){
        item = null;
      }else item = item;
      return item;
    });
    const filteredDescImgPosArr = descImgPosArr.filter((item) => item !== indextoRemove);
    setDescriptionImages(filteredDescriptionImages);
    setDescImgPosArr(filteredDescImgPosArr);
  }

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    if (!coverImage) alert("cover image deo");
    const formData = new FormData();
    /* console.log(descriptions); */
    formData.append("title", title);
    formData.append("coverImage[imageTitle]", coverImageTitle);
    const myDescriptions = JSON.stringify(descriptions);
    formData.append("descriptions", myDescriptions);

    formData.append("descImgPosArr", descImgPosArr);

    /* console.log(coverImage); */
    formData.append("coverImage", coverImage);
    descriptionImages.forEach((image, i) => {
      formData.append(`descriptionImage`, image);
    });
    const data = await axios.post("http://localhost:8000/saveblog", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    /* console.log(data); */
  };

  return (
    <div className="blog-create-container">
      <h1 className="text-center">Create a Blog Post</h1>
      <form
        onSubmit={(e) => {
          handleBlogSubmit(e);
        }}
        method="POST"
        encType="multipart/form-data"
        className="blog-create-form"
      >
        <label htmlFor="coverImage" className="cover-image">
          Cover Image:
          <Dragdrop
            coverImageProperty={{ image: coverImage, setImage: setCoverImage }}
            descriptionImageProperty={{}}
          >
            <input
              type="file"
              id="coverImage"
              name="coverImage"
              onChange={(e) => {
                setCoverImage(e.target.files[0]);
                /* console.log(coverImage); */
              }}
              hidden
            />
          </Dragdrop>
        </label>
        {/* Cover Image */}
        <input
          type="text"
          id="coverImageTitle"
          name="coverImage[imageTitle]"
          placeholder="cover image title"
          onChange={(e) => {
            setCoverImageTitle(e.target.value);
          }}
          required
          value={coverImageTitle}
          className="image-title my-2"
        />
        <br />

        <br />
        {/* Blog Title */}
        <input
          type="text"
          id="title"
          name="title"
          className="blog-title-input"
          placeholder="Give your blog a title"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          required
          value={title}
        />
        <br />
        <br />

        <br />
        <br />

        {descriptions.map((item, i) => {
          return (
            <div id="descriptions" key={i}>

              {i !==0 && (
                <button className="btn-section-remove d-block ms-auto p-2">
                  Remove section
                </button>
              )}

              {i === 0 && (
                <textarea
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => {
                    handleDescriptionsChange(e.target.value, i, "description");
                  }}
                  className="blog-description-input"
                />
              )}

              {/* description image section*/}
              <div className="my-3">
                {!item.hasOwnProperty("descriptionImage") && (
                  <div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addProperty(i, "descriptionImage");
                      }}
                      className="add-btn"
                    >
                      add Image
                    </button>
                  </div>
                )}

                {item.hasOwnProperty("descriptionImage") && (
                  <div className="description-image my-3">
                    <label htmlFor={`descriptionImage${i}`} className="w-100">
                      <Dragdrop
                        coverImageProperty={{}}
                        descriptionImageProperty={{
                          image: descriptionImages[i],
                          handleDescriptionImage: handleDescriptionImage,
                          i: i,
                        }}
                      >
                        <input
                          id={`descriptionImage${i}`}
                          type="file"
                          name="coverImage"
                          onChange={(e) => {
                            handleDescriptionImage(e.target.files[0], i);
                          }}
                          hidden
                        />
                      </Dragdrop>
                    </label>
                    <input
                      type="text"
                      placeholder="Image title"
                      onChange={(e) => {
                        handleDescriptionImageTitle(e.target.value, i);
                      }}
                      required
                      className="image-title my-2"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeDescriptionImage(i);
                        removeProperty(i, "descriptionImage");
                      }}
                      className="remove-btn"
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>

              {/* description section */}
              <div className="my-4">
                {i !== 0 && item.hasOwnProperty("description") && (
                  <div>
                    <textarea
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => {
                        handleDescriptionsChange(
                          e.target.value,
                          i,
                          "description"
                        );
                      }}
                      className="blog-description-input mb-3"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeProperty(i, "description");
                      }}
                      className="remove-btn d-block ms-auto"
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
                      className="add-btn"
                    >
                      add description
                    </button>
                  </div>
                )}
              </div>

              {/* video section */}
              <div className="my-3">
                {!item.hasOwnProperty("videoUrl") && (
                  <div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addProperty(i, "videoUrl");
                      }}
                      className="add-btn"
                    >
                      add video
                    </button>
                  </div>
                )}

                {item.hasOwnProperty("videoUrl") && (
                  <div className="d-flex justify-content-between align-items-center">
                    <input
                      type="text"
                      placeholder="videourl"
                      value={item.videoUrl}
                      onChange={(e) => {
                        handleDescriptionsChange(e.target.value, i, "videoUrl");
                      }}
                      className="video-url-input"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeProperty(i, "videoUrl");
                      }}
                      className="remove-btn"
                    >
                      Remove video
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Add more section */}
        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              setDescriptions([...descriptions, {}]);
              setDescriptionImages([...descriptionImages, null]);
            }}
            className="add-section-btn"
          >
            Add section
          </button>
        </div>
        {/* Submit Button */}
        <input type="submit" value="Create Blog Post" className="submit-blog"/>
      </form>
    </div>
  );
}

export default CreateBlog;
export { DragDropContext };
