import React, { useState, useEffect } from 'react';
import "../Sass/SearchResultP.scss";
import { useAuth } from "../userContext";
import { useNavigate } from 'react-router-dom';

function SearchResultPComponent({ userInfo, onFollow }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    if (currentUser.following.includes(userInfo.username)) {
      setFollowed(true);
    }
  }, [currentUser.following, userInfo.username]);

  const handleFollowClick = (e) => {
    e.stopPropagation(); 
    setFollowed(!followed);
    onFollow(userInfo.username);
  };

  const handleProfileClick = () => {
    navigate(`/user/${userInfo.username}`);
  };

  return (
    <div className='search-result-p' onClick={handleProfileClick}>
      <img
        src={userInfo.profilePictureUrl || '/blankprofile.png'}
        alt={`${userInfo.username}'s profile picture`}
      />
      <div className="search-result-p-user-details">
        <p className="search-result-p-username">{userInfo.username}</p>
        <button
          className={`search-result-p-follow-button ${followed ? 'followed' : ''}`}
          onClick={handleFollowClick}
        >
          {followed ? "Following" : "Follow"}
        </button>
      </div>
    </div>
  );
}

export default SearchResultPComponent;