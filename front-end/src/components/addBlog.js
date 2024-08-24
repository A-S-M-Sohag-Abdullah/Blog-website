import axios from "axios";
import React, { useEffect, useState } from "react";
import CreateBlog from "./createBlog";

function AddBlog() {
  const [permit, setPermit] = useState(false);

  useEffect(() => {
    (async () => {
      const permission = await axios.get("http://localhost:8000/addblogpermit");
      setPermit(permission.data.accountStatus);
    })();
  }, []);

  return <>{permit ? <CreateBlog/> : <h1>Not permitted</h1>}</>;
}

export default AddBlog;
