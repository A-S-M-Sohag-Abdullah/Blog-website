import axios from "axios";
import React, { useContext, useState } from "react";
import AuthContext from "../contexts/authcontext";

function Signup() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { getLoggedIn } = useContext(AuthContext);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const signedUp = await axios.post("http://localhost:8000/signup", {
        userName,
        email,
        password,
      });
      getLoggedIn();
      console.log(signedUp);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="signup">
      <h1>Sign Up</h1>
      <br />
      <input
        type="text"
        id="UserName"
        name="userName"
        placeholder="Enter User Name"
        onChange={(e) => {
          setUserName(e.target.value);
        }}
        required
        value={userName}
      />

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
      <button onClick={handleSignup}>Sign up</button>
    </div>
  );
}

export default Signup;
