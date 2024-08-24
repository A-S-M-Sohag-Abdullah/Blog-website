import {
  faEnvelope,
  faUser,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchBox from "./searchBox";

export const AdminControl = () => {
  const [bloogers, setBloogers] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");

  const chageStatus = async (id, status) => {
    status = status ? false : true;

    const data = await axios.post(`http://localhost:8000/updateblogger/${id}`, {
      accountStatus: status,
    });

    const updatedbloogers = bloogers.map((blogger) =>
      blogger._id === id ? { ...blogger, accountStatus: status } : blogger
    );
    setBloogers(updatedbloogers);
  };

  useEffect(() => {
    (async () => {
      const data = await axios.get(
        `http://localhost:8000/bloggerlist?email=${searchEmail}`
      );

      setBloogers(data.data);
      console.log(data);
    })();
  }, [searchEmail]);

  return (
    <>
      <SearchBox searchTerm={searchEmail} setSearchTerm={setSearchEmail} placeholder = "Search with Email"/>
      <ul className="blogger-list">
        {bloogers &&
          bloogers.map((blogger, index) => {
            return (
              <li className="bloger">
                <div
                  className="me-3 
                blogger-name"
                >
                  <FontAwesomeIcon icon={faUserAlt} className="me-2" />
                  {blogger.username}
                </div>

                <div className="blogger-mail mx-auto">
                  <FontAwesomeIcon icon={faEnvelope} className="me-2" /> :
                  {blogger.email}
                </div>

                <button
                  className="blogger-status-btn"
                  style={
                    !blogger.accountStatus ? { backgroundColor: "red" } : null
                  }
                  onClick={() => {
                    chageStatus(blogger._id, blogger.accountStatus);
                  }}
                >
                  Change blogger status
                </button>
                <div className="blogger-status">
                  {blogger.accountStatus ? "true" : "false"}
                </div>
              </li>
            );
          })}
      </ul>
    </>
  );
};
