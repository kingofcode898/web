
import { createBrowserRouter } from "react-router-dom";
import Login from "../Pages/Login";
import SignUp from "../Pages/SignUp";
import Home from "../Pages/Home";
import Profile from "../Pages/Profile";


export const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />
    },
    {
      path: "/signup",
      element: <SignUp/>
    },
    {
      path: "/home",
      element: <Home/>
    },
    {
      path: "/profile",
      element: <Profile/>
    }
  ]);