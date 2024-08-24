import React, { createContext, useEffect, useState, useMemo } from "react";
import axios from "axios";

const AuthContext = createContext();

function AuthContextProvider(props) {
  const [loggedIn, setLoggedIn] = useState(null); // Start with null or undefined

  async function getLoggedIn() {
    try {
      const loggedInResponse = await axios.get(
        "http://localhost:8000/loggedIn"
      );
      setLoggedIn(loggedInResponse.data);
    } catch (error) {
      console.error("Error fetching logged in status:", error);
    }
  }

  useEffect(() => {
    getLoggedIn();
  }, []);

  const value = useMemo(() => ({ loggedIn, getLoggedIn }), [loggedIn]);

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
}

export default AuthContext;
export { AuthContextProvider };
