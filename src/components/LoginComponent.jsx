import React, { useContext, useState } from "react";
import { LoginAPI } from "../api/AuthAPI";
import "../Sass/LoginComponent.scss";
import Logo from "../assets/cross1.png";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../userContext";
import { findUser } from "../api/DataBaseAPI";


//login component
export default function LoginComponent() {
  //makes call to login function from API
  const [credentials, setCredentials] = useState({});
  const navigate = useNavigate()
  const [CurrentUser, setCurrentUser] = useContext(UserContext)
  //login API call
  const login = async () => {
    try {
      let res = await LoginAPI(credentials.email, credentials.password);
      
      const user = await findUser(credentials.email);
      const userData = user[1]
      const userid = user[0]

      console.log(userData)
      
      setCurrentUser({
          ID: userid,
          email: credentials.email,
          password: credentials.password,
          username: userData.username,  
          followers: userData.followers,
      })

      if (res?.user) {
        navigate('/Home');
      } else {
        console.log('Login failed');
      }
    } catch (err) {
      console.log(err);
    }
  };

  // html content returned from this component
  return (
    
    <div className="login-wrapper">
        <img src={Logo} className="Logo" />
      <h1 className="heading">Sign in</h1>
      <p className="subheading">Check in with the people</p>
       <div className="auth-inputs">
        <input
          onChange={(event) =>
            setCredentials({ ...credentials, email: event.target.value })
          }
          className="common-input"
          id="email-login"
          placeholder="Email"
        />
        <input
          onChange={(event) =>
            setCredentials({ ...credentials, password: event.target.value })
          }
          className="common-input"
          id="password-login"
          placeholder="Password"
        />
        <button onClick={login} className="login-btn">
          Log in{" "}
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
