import axios from "axios";
import React, { createContext, useEffect, useMemo, useState } from "react";

const AdminAuthContext = createContext();

function AdminAuthContextProvider(props) {
  const [adminLoggedIn, setAdminLoggedIn] = useState(null); // Start with null or undefined

  async function getAdminLoggedIn() {
    try {
      const adminLoggedInResponse = await axios.get(
        "http://localhost:8000/adminloggedIn"
      );
      setAdminLoggedIn(adminLoggedInResponse.data);
    } catch (error) {
      console.error("Error fetching logged in status:", error);
    }
  }

  useEffect(() => {
    getAdminLoggedIn();
  }, []);

  const value = useMemo(
    () => ({ adminLoggedIn, getAdminLoggedIn }),
    [adminLoggedIn]
  );
  return (
    <AdminAuthContext.Provider value={value}>
      {props.children}
    </AdminAuthContext.Provider>
  );
}
export default AdminAuthContext;
export { AdminAuthContextProvider };
