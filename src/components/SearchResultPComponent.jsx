import React, { useState } from 'react';
import "../Sass/SearchResultP.scss";
import {useAuth} from "../userContext"
import { useEffect } from 'react';
function SearchResultPComponent({ userInfo, onFollow }) {
  const {currentUser} = useAuth()
  
  const [followed, setFollowed] = useState(false);

   useEffect(() => {
    if(currentUser.following.includes(userInfo.username)){
      setFollowed(true)
    }
  }, [])
  

  const handleClick = () => {
    setFollowed(!followed);
    onFollow(userInfo.username);
  };

  return (
    <div className='search-result-p'>
      <img src={userInfo.profilePictureUrl} alt={`${userInfo.username}'s profile picture`} />
      <div className="user-details">
        <p className="username">{userInfo.username}</p>
        <button
          className={`follow-button ${followed ? 'followed' : ''}`}
          onClick={handleClick}
        >
          {followed ? "Following" : "Follow"}
        </button>
      </div>
    </div>
  );
}

export default SearchResultPComponent;