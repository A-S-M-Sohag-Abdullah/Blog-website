import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import Dragdrop from "./dragdrop";
/* import "bootstrap/dist/css/bootstrap.min.css"; */
import { useNavigate, useParams } from "react-router-dom";
import PublicBlogContext from "../contexts/publicBlogContext";

const DragDropContext = createContext();

function CreateBlog() {
  const categories = [
    "Technology",
    "Health",
    "Finance",
    "Education",
    "Entertainment",
  ];

  const { getBlogs } = useContext(PublicBlogContext);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [isUpdating, setIsUpdating] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  // form post data
  const [title, setTitle] = useState("");
  const [coverImageTitle, setCoverImageTitle] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [descriptions, setDescriptions] = useState([{ description: "" }]);
  const [descriptionImages, setDescriptionImages] = useState([null]);
  const [descImgPosArr, setDescImgPosArr] = useState([]);

  //old image urls for update purpose
  const [oldImageUrls, setOldImageUrls] = useState([]);

  const addProperty = (i, property) => {
    const newDescriptions = descriptions.map((item, itemIndex) => {
      if (i !== itemIndex) return item;
      else {
        if (property !== "descriptionImage") {
          item[property] = "";
        } else {
          item[property] = {};
          item[property]["imageTitle"] = "";
        }
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

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleDescriptionsChange = (value, i, fieldname) => {
    console.log(value);
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
    //console.log("ekhen asce");
    if (files) {
      /* console.log("ekhane asce"); */

      //console.log(i);
      files.order = i;
      //console.log(files);
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
        /* console.log(descImgPosArr); */
        /*   setDescImgPosArr(descImgPosArr.sort());
        console.log(descImgPosArr); */
      } else if (descImgPosArr.indexOf(i) >= -1) {
        const newDescriptionImage = descriptionImages.map((item, itemIndex) => {
          if (i !== itemIndex) return item;
          else {
            item = files;
            return item;
          }
        });
        //console.log(descriptionImages);
        setDescriptionImages(newDescriptionImage);
      }
    } else return;
  };

  const removeDescriptionImage = (indextoRemove) => {
    const filteredDescriptionImages = descriptionImages.map((item, index) => {
      if (index === indextoRemove) {
        item = null;
      } else item = item;
      return item;
    });
    const filteredDescImgPosArr = descImgPosArr.filter(
      (item) => item !== indextoRemove
    );
    setDescriptionImages(filteredDescriptionImages);
    setDescImgPosArr(filteredDescImgPosArr);
  };

  const removeSection = (indexToRemove) => {
    const filteredDescriptions = descriptions.filter(
      (item, index) => index !== indexToRemove
    );
    setDescriptions(filteredDescriptions);

    const filteredDescriptionImages = descriptionImages.filter(
      (item, index) => index !== indexToRemove
    );
    setDescriptionImages(filteredDescriptionImages);
    const filteredDescImgPosArr = descImgPosArr
      .filter((item) => item !== indexToRemove)
      .map((item) => {
        if (item >= indexToRemove) item--;
        return item;
      });
    console.log(filteredDescImgPosArr);
    setDescImgPosArr(filteredDescImgPosArr);
  };

  const handleBlogSubmit = async (e) => {
    //console.log(descriptionImages);
    e.preventDefault();
    if (!coverImage) alert("cover image deo");
    const formData = new FormData();

    const myDescriptions = JSON.stringify(descriptions);
    //console.log(myDescriptions);

    formData.append("category", selectedCategory);
    formData.append("title", title);
    formData.append("coverImage[imageTitle]", coverImageTitle);
    formData.append("descriptions", myDescriptions);
    formData.append("descImgPosArr", descImgPosArr);
    formData.append("coverImage", coverImage);

    descriptionImages.forEach((image, i) => {
      formData.append(`descriptionImage${i}`, image);
    });
    //console.log(descriptionImages);
    //console.log(formData);

    if (isUpdating) formData.append("oldImageUrls", oldImageUrls);

    let requestString = isUpdating
      ? `http://localhost:8000/updateblog/${params.id}`
      : "http://localhost:8000/upload";
    const data = await axios.post(requestString, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(data);
    if (params.id) navigate(`/blogs/${params.id}`);
    else {
      navigate(`/blogs/${data.data._id}`);
    }

    getBlogs();
  };

  useEffect(() => {
    if (params.id) setIsUpdating(true);
    else setIsUpdating(false);
    if (isUpdating)
      (async () => {
        const blog = await axios.get(`http://localhost:8000/blog/${params.id}`);

        const imageUrl = `http://localhost:8000/images/${blog.data.coverImage.imageurl}`;
        const response = await fetch(imageUrl);
        //console.log(response);
        const blob = await response.blob();
        const file = new File([blob], response.url, { type: "image/jpeg" });
        setTitle(blog.data.title);
        setCoverImage(file);
        setCoverImageTitle(blog.data.coverImage.imageTitle);
        setSelectedCategory(blog.data.category);
        const oldDescriptions = blog.data.descriptions.map((item, index) => {
          return item;
        });
        console.log(oldDescriptions);
        setDescriptionImages([]);
        setDescriptions(oldDescriptions);
        setDescImgPosArr([]);
        const updatedImages = await Promise.all(
          oldDescriptions.map(async (item, index) => {
            if (item.descriptionImage !== null) {
              const imageUrl = `http://localhost:8000/images/${item.descriptionImage.imageurl}`;

              const response = await fetch(imageUrl);
              //console.log(response);

              const blob = await response.blob();
              const file = new File([blob], response.url, {
                type: "image/jpeg",
              });

              return file;
            } else {
              return null;
            }
          })
        );
        const oldPictureImgaeUrls = blog.data.descriptions
          .map((item, index) => {
            if (item.descriptionImage !== null)
              return item.descriptionImage.imageurl;
          })
          .filter((item) => item !== undefined);
        const oldDesImgPosArr = blog.data.descriptions
          .map((item, index) => {
            if (item.descriptionImage !== null) return index;
          })
          .filter((index) => index !== undefined);

        //console.log(updatedImages);
        setDescImgPosArr(oldDesImgPosArr);
        setOldImageUrls(oldPictureImgaeUrls);
        setOldImageUrls([
          ...oldPictureImgaeUrls,
          blog.data.coverImage.imageurl,
        ]);
        setDescriptionImages(updatedImages);
      })();
    else {
      setTitle("");
      setCoverImageTitle("");
      setCoverImage(null);
      setDescriptions([{ description: "" }]);
      setDescriptionImages([null]);
      setDescImgPosArr([]);
      setOldImageUrls([]);
    }
  }, [params.id, isUpdating]);

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
        <select value={selectedCategory} onChange={handleCategoryChange}>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>

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
              {i !== 0 && (
                <button
                  className="btn-section-remove d-block ms-auto p-2"
                  onClick={(e) => {
                    e.preventDefault();
                    removeSection(i);
                  }}
                >
                  Remove section
                </button>
              )}

              {i === 0 && (
                <div key={i}>
                  <textarea
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                    onChange={(e) => {
                      handleDescriptionsChange(
                        e.target.value,
                        i,
                        "description"
                      );
                    }}
                    className="blog-description-input mb-3"
                    value={item.description}
                  ></textarea>
                </div>
              )}

              {/* description image section*/}
              <div className="my-3">
                {!item.hasOwnProperty("descriptionImage") &&
                  item.descriptionImage == null && (
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

                {item.hasOwnProperty("descriptionImage") &&
                  item.descriptionImage !== null && (
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
                            name="descriptionImage"
                            onChange={(e) => {
                              handleDescriptionImage(e.target.files[0], i);
                            }}
                            hidden
                          />
                        </Dragdrop>
                      </label>
                      <input
                        type="text"
                        value={item.descriptionImage.imageTitle}
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
                    <div key={i}>
                      <textarea
                        onInput={(e) => {
                          e.target.style.height = "auto";
                          e.target.style.height = e.target.scrollHeight + "px";
                        }}
                        onChange={(e) => {
                          handleDescriptionsChange(
                            e.target.value,
                            i,
                            "description"
                          );
                        }}
                        className="blog-description-input mb-3"
                        value={item.description}
                      ></textarea>
                    </div>

                    {/* <textarea
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
                    /> */}
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
                {(!item.hasOwnProperty("videoUrl") ||
                  item.videoUrl == null) && (
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

                {item.hasOwnProperty("videoUrl") && item.videoUrl !== null && (
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
        <input
          type="submit"
          value={isUpdating ? "Save blog" : "Create Blog Post"}
          className="submit-blog"
        />
      </form>
    </div>
  );
}

export default CreateBlog;
export { DragDropContext };
