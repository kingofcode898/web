// userContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firebaseConfig';
import { findUserWEmail } from './api/DataBaseAPI';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const onRefresh = async (user) =>{
    const UserInfo = await findUserWEmail(user.email); // returns [userId, UserInfo]

      setCurrentUser({
        ID: UserInfo[0],
        email: UserInfo[1].email,
        password: UserInfo[1].password,
        username: UserInfo[1].username,
        num_followers: UserInfo[1].num_followers,
        num_following: UserInfo[1].num_following,
        followers: UserInfo[1].followers,
        following: UserInfo[1].following,
        posts_created: UserInfo[1].posts_created, 
        profilePictureURL: UserInfo[1].profilePictureUrl
      });

      console.log("current user: ", currentUser)
  }

  

  useEffect( () => {
    
    const unsubscribe = auth.onAuthStateChanged(user => {
      
      onRefresh(user)
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