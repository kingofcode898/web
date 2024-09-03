// userContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firebaseConfig';
import { findUserWEmail } from './api/DataBaseAPI';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const onRefresh = async () =>{
      let userInfo = JSON.parse(localStorage.getItem("user-info"))

      
      let result = await findUserWEmail(userInfo.email)

       userInfo  = {
      ...result[1], 
      id: result[0]
      }

      console.log(userInfo)

      setCurrentUser(userInfo)

  }

  useEffect( () => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      onRefresh()
      setLoading(false);
    })

    return unsubscribe;
  }, []);

  


  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};