import React from 'react';
import "../Sass/SearchResultP.scss";

function SearchResultPComponent({ userInfo, onFollow }) {
  return (
    <div className='search-result-p'>
      <img src={userInfo.profilePictureUrl} alt={`${userInfo.username}'s profile picture`} />
      <div className="user-details">
        <p className="username">{userInfo.username}</p>
        <button className="follow-button" onClick={onFollow(userInfo.username)}>
          Follow
        </button>
      </div>
    </div>
  );
}

export default SearchResultPComponent;