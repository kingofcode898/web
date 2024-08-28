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
      const userInfo = JSON.parse(localStorage.getItem("user-info"))
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