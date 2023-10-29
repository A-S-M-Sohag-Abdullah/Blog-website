import React, { useContext, useRef, useState } from "react";
import { DragDropContext } from "./createBlog";

function Dragdrop({ children }) {
  const [isDragging, setIsDragging] = useState(false);
  const [droppedImage, setDroppedImage] = useState(null);
  const inputRef = useRef(null);

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
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    console.log("Dropped files:", files);
    if (files.length > 0) {
      const image = files[0];
      setDroppedImage(URL.createObjectURL(image));
    }
  };

  const handleButtonClick = (e) => {
    // Trigger the click event on the input element
    e.preventDefault();
    if (inputRef.current) {
      inputRef.current.click();
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
        {droppedImage ? (
          <img src={droppedImage} alt="Dropped" />
        ) : isDragging ? (
          <span>Drop picture here</span>
        ) : (
          <span>
            Drag and drop picture here <p>or click here to add image</p>
          </span>
        )}
      </div>

      {React.cloneElement(children, { ref: inputRef })}

      <button onClick={(e) => handleButtonClick(e)}>Upload File</button>
    </div>
  );
}

export default Dragdrop;
