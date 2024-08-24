import axios from "axios";
import React, { useEffect, useState } from "react";
import SearchBox from "./searchBox";
import DisplayBlogs from "./displayBlogs";
import { AdminControl } from "./adminControl";
import BlogControlAdmin from "./blogControlAdmin";

//import { BlogContext } from "../contexts/blogContext";
const BlogContext = React.createContext(0);
export { BlogContext };

function AdminPanel() {
  const [blogs, setBlogs] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");

  useEffect(() => {
    (async () => {
      const blog = await axios.get(
        `http://localhost:8000/blogger/blogs?title=${searchTitle}`
      );
      console.log(blog.data);
      setBlogs(blog.data);
    })();
  }, [searchTitle]);

  const contextValue = {
    blogs,
    setBlogs,
  };
  return (
    <BlogContext.Provider value={contextValue}>
      <SearchBox searchTerm={searchTitle} setSearchTerm={setSearchTitle} placeholder = "Search with Title"/>
      <DisplayBlogs blogs={blogs} />
      {/* <BlogControlAdmin />
      <AdminControl /> */}
    </BlogContext.Provider>
  );
}

export default AdminPanel;
