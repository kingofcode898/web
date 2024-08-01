import React, { useState } from "react";
import "../Sass/LoginComponent.scss";
import Logo from "../assets/cross1.png";
import { Link, useNavigate } from "react-router-dom";
import { LoginAPI } from "../api/AuthAPI";
import { useAuth } from "../userContext";
import { findUser } from "../api/DataBaseAPI";

export default function LoginComponent() {
  const { currentUser, setCurrentUser } = useAuth(); 
  const [usrCredentials, setUsrCredentials] = useState({});
  const navigate = useNavigate();
  const [failedLogin, setFailedLogin] = useState(false)
   
  const loginUsr = async () => {
    try {
      const response = await LoginAPI(usrCredentials.email, usrCredentials.password);
      const UserInfo = await findUser(usrCredentials.email)// returns [userId, UserInfo]
      
      setCurrentUser({
        ID: UserInfo[0],
        email: UserInfo[1].email,
        password: UserInfo[1].password,
        username: UserInfo[1].username,
        followers: UserInfo[1].num_followers,
        following: UserInfo[1].num_following
      })

      if (response != false) {
        navigate('/')
      } else { 
        setFailedLogin(true)
      }

      

    } catch (err) {
      console.log(err);
    }
  };

  
  return (
    
    <div className="login-wrapper">
        <img src={Logo} className="Logo" />
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
            setUsrCredentials({ ...usrCredentials, password: event.target.value })
          }
          className="common-input"
          id="password-login"
          type="password"
          placeholder="Password"
        />
        <button onClick={loginUsr} className="login-btn">
          Log in
        </button>
        <p className="subtext">New to the App create an account?</p>
        <Link className="link" to="/signup">Create an account</Link>
        <div className="test">
          <div className="test2"></div>
        </div>
      </div> 
    </div>
  );
}
