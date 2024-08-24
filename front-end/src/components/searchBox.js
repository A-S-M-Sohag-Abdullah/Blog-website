import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function SearchBox({ searchTerm, setSearchTerm, placeholder }) {
  return (
    <div>
      <input
        type="text"
        id="searchTitle"
        name="searchTitle"
        placeholder={placeholder}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        required
        value={searchTerm}
        className="mb-5"
      />
    </div>
  );
}

export default SearchBox;
