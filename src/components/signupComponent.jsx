import React, { useState, useContext, useEffect } from "react";
import { RegisterAPI } from "../api/AuthAPI";
import "../Sass/LoginComponent.scss";
import Logo from "../assets/cross1.png";
import { Link, useNavigate } from "react-router-dom";
import { addUserDb } from "../api/DataBaseAPI";
import { useAuth } from "../userContext";

function SignupComponent() {
  // stores all credentials from the input;
  const [credentials, setCredentials] = useState({});
  const navigate = useNavigate();
  const {currentUser, setCurrentUser } = useAuth();

  const SignUp = async () => {
    try {
      let res = await RegisterAPI(credentials.email, credentials.password);
      console.log(res?.user);

      //IF they dont already exist.
      if (res?.user) {
        
        // Get the path to the file that contains user info
        const ID = await addUserDb(
          credentials.username,
          credentials.email,
          credentials.password,
          credentials.bday
        );

        console.log(ID.id);
        //makes the new signed up user the current user for the app
        setCurrentUser({
          ID: ID.id,
          email: credentials.email,
          password: credentials.password,
          username: credentials.username,
          num_followers: 0,
          num_following: 0,
          followers: [], 
          following: []
        });

        navigate("/")
      }
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
            setCredentials({ ...credentials, username: event.target.value })
          }
          className="common-input"
          placeholder="username"
        />
        {/* <input
          onChange={(event) =>
            setCredentials({ ...credentials, username: event.target.value })
          }
          className="common-input"
          type="date"
          placeholder="Enter your bday"
        /> */}
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
        <button onClick={SignUp} className="login-btn">
          Create{" "}
        </button>
        <p className="subtext">Already have an account?</p>
        <Link className="link" to="/login">
          Log in
        </Link>
      </div>
    </div>
  );
}

export default SignupComponent;
