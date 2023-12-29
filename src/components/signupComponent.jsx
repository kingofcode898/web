import React, { useState, useContext, useEffect } from "react";
import { RegisterAPI } from "../api/AuthAPI";
import "../Sass/LoginComponent.scss";
import Logo from "../assets/cross1.png";
import { Link, useNavigate } from "react-router-dom";
import { addUserDb } from "../api/DataBaseAPI";
import { UserContext } from "../userContext";

function SignupComponent() {
  // stores all credentials from the input;
  const [credentials, setCredentials] = useState({});
  const navigate = useNavigate();
  const [UserID, setUserID] = useContext(UserContext);

  useEffect(() => {
    // This effect will run whenever UserID changes
    console.log(`User ID success! This is the ID ${UserID}`);
    
    // Navigates to home page if the ID was set
    if (UserID) {
      navigate("/home");
    }
  }, [UserID]);

  const SignUp = async () => {
    try {
      let res = await RegisterAPI(credentials.email, credentials.password);
      console.log(res?.user);

      // If registration was good
      if (res?.user) {
        // Get the path to the file that contains user info
        const ID = await addUserDb(
          credentials.username,
          credentials.email,
          credentials.password
        );

        console.log(ID.id);
        setUserID(ID.id);
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
        <Link className="link" to="/">
          Log in
        </Link>
      </div>
    </div>
  );
}

export default SignupComponent;
