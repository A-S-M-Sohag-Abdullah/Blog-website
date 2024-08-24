import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";

const PublicBlogContext = React.createContext(0);

function PublicBlogContextProvider(props) {
  const [blogs, setBlogs] = useState([]);

  async function getBlogs(params) {
    const blog = await axios.get("http://localhost:8000/publicblog");
    setBlogs(blog.data);
  }

  useEffect(() => {
    getBlogs();
  }, []);

  const value = useMemo(() => ({ blogs, getBlogs }));
  return (
    <PublicBlogContext.Provider value={value}>
      {props.children}
    </PublicBlogContext.Provider>
  );
}
export { PublicBlogContextProvider };
export default PublicBlogContext;
