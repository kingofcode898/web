import React from "react";
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from "../userContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useAuth(); //creates the user constant what does th ebraces do? 

  return (
    <Route
      {...rest}
      render={props =>
        currentUser ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default PrivateRoute;