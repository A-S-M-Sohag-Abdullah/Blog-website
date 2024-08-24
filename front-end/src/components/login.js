import axios from "axios";
import React, { useContext, useState } from "react";
import AuthContext from "../contexts/authcontext";
import AdminAuthContext from "../contexts/adminauthContext";

axios.defaults.withCredentials = true;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { getLoggedIn } = useContext(AuthContext);
  const { getAdminLoggedIn } = useContext(AdminAuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8000/login`, {
        email,
        password,
      });
      getLoggedIn();
      getAdminLoggedIn();
      return response.data;
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="login">
      <h1>Login</h1>

      <br />
      <br />
      <input
        type="email"
        id="Email"
        name="email"
        placeholder="Enter Email"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        required
        value={email}
      />
      <br />
      <br />
      <input
        type="password"
        id="Password"
        name="password"
        placeholder="Enter Password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        required
        value={password}
      />
      <br />
      <br />
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
};

export default Login;
