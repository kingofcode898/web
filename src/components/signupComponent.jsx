import React, { useState } from "react";
import { RegisterAPI } from "../api/AuthAPI";
import "../Sass/LoginComponent.scss";
import Logo from "../assets/cross1.png";
import { Link } from "react-router-dom";

function SignupComponent() {
    const [credentials, setCredentials] = useState({});
    const login = async () => {
      try {
        let res = await RegisterAPI(credentials.email, credentials.password);
        console.log(res?.user);
      } catch (err) {
        console.log(err);
      }
    };
  
    return (
      <div className="login-wrapper">
      <img src={Logo} className="Logo" />
    <h1 className="heading">Sign Up</h1>
    <p className="subheading">Join us today!</p>
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
         Create {" "}
      </button>
      <p className="subtext">Already have an account?</p>
      <Link className="link" to="/">Log in</Link>
    </div> 
  </div>
  )
}

export default SignupComponent