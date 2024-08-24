import React, { useState } from "react";

function Dragdrop({ coverImageProperty, descriptionImageProperty, children }) {
  const image = coverImageProperty.image || descriptionImageProperty.image;
  const setImage = coverImageProperty.setImage || null;
  const handleDescriptionImage = descriptionImageProperty.handleDescriptionImage || null;
  const i = descriptionImageProperty.i || null;

  const [isDragging, setIsDragging] = useState(false);
  const [droppedImage, setDroppedImage] = useState(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    /* console.log("Dropped files:", files); */
    if (files.length > 0) {
      const imageDropped = files[0];
      console.log(imageDropped);

      if (coverImageProperty.setImage) {
        setImage(imageDropped);
        console.log(image);
      }else if(descriptionImageProperty.handleDescriptionImage){
        /* console.log('ekhaneo asce'); */
        handleDescriptionImage(imageDropped,descriptionImageProperty.i);
      }

      console.log(handleDescriptionImage);
      console.log(descriptionImageProperty.i);
      setDroppedImage(URL.createObjectURL(imageDropped));
    }
  };

  return (
    <div>
      <div
        className={`drop-area ${isDragging ? "dragging" : ""}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {image ? (
          <img src={URL.createObjectURL(image)} alt="Dropped" />
        ) : isDragging ? (
          <span>Drop picture here</span>
        ) : (
          <span>
            Drag and drop picture here <p>or click here to add image</p>
          </span>
        )}
      </div>

      {children}
    </div>
  );
}

export default Dragdrop;
