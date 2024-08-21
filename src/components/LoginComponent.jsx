// LoginComponent.js

import React, { useState } from "react";
import "../Sass/LoginComponent.scss";
import Logo from "../assets/cross1.png";
import { Link, useNavigate } from "react-router-dom";
import { LoginAPI } from "../api/AuthAPI";
import { useAuth } from "../userContext";
import { findUserWEmail } from "../api/DataBaseAPI";

export default function LoginComponent() {
  const { setCurrentUser } = useAuth();
  const [usrCredentials, setUsrCredentials] = useState({});
  const navigate = useNavigate();
  const [failedLogin, setFailedLogin] = useState(false);

  const loginUsr = async () => {
    try {
      const response = await LoginAPI(
        usrCredentials.email,
        usrCredentials.password
      );
      const UserInfo = await findUserWEmail(usrCredentials.email); // returns [userId, UserInfo]

      if (response !== false) {
        const loggedInUser = {
          ID: UserInfo[0],
          email: UserInfo[1].email,
          password: UserInfo[1].password,
          username: UserInfo[1].username,
          num_followers: UserInfo[1].num_followers,
          num_following: UserInfo[1].num_following,
          followers: UserInfo[1].followers,
          following: UserInfo[1].following,
          posts_created: UserInfo[1].posts_created, 
          profilePictureURL: UserInfo[1].profilePictureUrl,
          bio: UserInfo[1].bio
        };
        const userInfoString = JSON.stringify(loggedInUser);
        console.log(userInfoString)
        localStorage.setItem("user-info", userInfoString)
        
        setCurrentUser(loggedInUser);

        navigate("/");
      } else {
        setFailedLogin(true);
      }
    } catch (err) {
      console.log(err);
      setFailedLogin(true);
    }
  };

  const handleEnterKey = (event) => {
    if (event.key === "Enter") {
      loginUsr();
      console.log("Enter key was pressed");
    }
  };

  return (
    <div className="login-wrapper">
      <img src={Logo} className="Logo" alt="Logo" />
      <h1 className="heading">Sign in</h1>
      <p className="subheading">Check in with the people</p>
      <div className="auth-inputs">
        <input
          onChange={(event) =>
            setUsrCredentials({ ...usrCredentials, email: event.target.value })
          }
          className="common-input"
          id="email-login"
          placeholder="Email"
        />
        <input
          onChange={(event) =>
            setUsrCredentials({
              ...usrCredentials,
              password: event.target.value,
            })
          }
          className="common-input"
          id="password-login"
          type="password"
          placeholder="Password"
          onKeyDown={handleEnterKey}
        />
        <button onClick={loginUsr} className="login-btn">
          Log in
        </button>
        {failedLogin && (
          <p className="error-message">Login failed. Please try again.</p>
        )}
        <p className="subtext">New to the App? Create an account!</p>
        <Link className="link" to="/signup">
          Create an account
        </Link>
        <div className="test">
          <div className="test2"></div>
        </div>
      </div>
    </div>
  );
}
