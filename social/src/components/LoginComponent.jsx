import React, { useState } from "react";
import { RegisterAPI } from "../api/AuthAPI";
import "../Sass/LoginComponent.scss";
import Logo from "../assets/cross1.png";

//login component
export default function LoginComponent() {
  //makes call to login function from API
  const [credentials, setCredentials] = useState({});
  const login = async () => {
    try {
      let res = await RegisterAPI(credentials.email, credentials.password);
      console.log(res?.user);
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
          placeholder="Email"
        />
        <input
          onChange={(event) =>
            setCredentials({ ...credentials, password: event.target.value })
          }
          className="common-input"
          placeholder="Password"
        />
        <button onClick={login} className="login-btn">
          Login{" "}
        </button>
      </div> 
    </div>
  );
}
