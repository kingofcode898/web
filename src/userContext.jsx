//userContext
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firebase';

const UserContext = createContext();//this is the u

export const useAuth = () => useContext(UserContext);//this is a funtion that uses the user state our own hook? 

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); //creates a state but of what type? 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};