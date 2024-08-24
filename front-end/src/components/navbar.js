import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../contexts/authcontext";
import axios from "axios";
import AdminAuthContext from "../contexts/adminauthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

function Navbar() {
  const { loggedIn, getLoggedIn } = useContext(AuthContext);

  const { adminLoggedIn, getAdminLoggedIn } = useContext(AdminAuthContext);

  const logout = async () => {
    try {
      await axios.get("http://localhost:8000/logout");
      getAdminLoggedIn();
      getLoggedIn();
    } catch (error) {}
  };

  return (
    <div className="nav-bar">
      <h2 className="logo">সোহাগের ব্লগস</h2>
      <ul className="links">
        {adminLoggedIn && (
          <>
            <li className="nav-link">
              <Link to="/admincontrol">Bloggers List</Link>
            </li>
            <li className="nav-link">
              <Link to="/adminblogcontrol">Blog List</Link>
            </li>
          </>
        )}
        {loggedIn && (
          <li className="nav-link">
            <Link to="/admin">Your Blogs</Link>
          </li>
        )}
        <li className="nav-link">
          <Link to="/blogs">Blogs</Link>{" "}
        </li>

        {loggedIn && (
          <li className="nav-link">
            <Link to="/addBlog" className="create-btn">
              <FontAwesomeIcon icon={faPlus} className=" me-2" />
              Create Blog
            </Link>
          </li>
        )}
        {!loggedIn && (
          <>
            <li className="nav-link">
              <Link to="/login" className="login-btn">
                <FontAwesomeIcon icon={faUser} /> Login
              </Link>
            </li>
            <li className="nav-link">
              <Link to="/signup" className="signUp-btn">
                Become A Blogger
              </Link>
            </li>
          </>
        )}

        {loggedIn && (
          <button className="logout-btn" onClick={logout}>
            <FontAwesomeIcon icon={faRightFromBracket} />
          </button>
        )}
      </ul>
    </div>
  );
}

export default Navbar;
