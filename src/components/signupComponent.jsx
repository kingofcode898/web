import React, { useState } from "react";
import { RegisterAPI, GoogleSignInAPI } from "../api/AuthAPI";
import "../Sass/LoginComponent.scss";
import Logo from "../assets/cross1.png";
import { Link, useNavigate } from "react-router-dom";
import { addUserDb } from "../api/DataBaseAPI";
import { useAuth } from "../userContext";

function SignupComponent() {
  const [credentials, setCredentials] = useState({});
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const SignUp = async () => {
    try {
      let res = await RegisterAPI(credentials.email, credentials.password);
      console.log(res?.user);

      if (res?.user) {
        const ID = await addUserDb(
          credentials.username,
          credentials.email,
          credentials.password,
          credentials.bday
        );

        console.log(ID.id);
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

        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      let res = await GoogleSignInAPI();
      if (res?.user) {
        console.log("Google Sign-In successful:", res.user);

        const ID = await addUserDb(
          res.user.displayName,
          res.user.email,
          "", // No password needed for Google Sign-In
          "" // You might want to handle additional user data separately
        );

        setCurrentUser({
          ID: ID.id,
          email: res.user.email,
          username: res.user.displayName,
          num_followers: 0,
          num_following: 0,
          followers: [],
          following: []
        });

        navigate("/");
      }
    } catch (err) {
      console.error("Google Sign-In error:", err);
    }
  };

  return (
    <div className="login-wrapper">
      <img src={Logo} className="Logo" alt="Logo" />
      <h1 className="heading">Sign Up</h1>
      <p className="subheading">Join us today!</p>
      <div className="auth-inputs">
        <input
          onChange={(event) =>
            setCredentials({ ...credentials, username: event.target.value })
          }
          className="common-input"
          placeholder="Username"
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
          type="password"
          placeholder="Password"
        />
        <button onClick={SignUp} className="login-btn">
          Create
        </button>
        {/* <p className="subtext">Or sign up with</p>
        <button type="button" class="login-with-google-btn" onClick={handleGoogleSignIn}>
          Sign up with Google
        </button> */}
        <p className="subtext">Already have an account?</p>
        <Link className="link" to="/login">
          Log in
        </Link>
      </div>
    </div>
  );
}

export default SignupComponent;