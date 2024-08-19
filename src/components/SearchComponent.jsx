import React, { useState } from 'react';
import '../Sass/SearchComponent.scss';
import { findUserWUsername , addFollow } from '../api/DataBaseAPI';
import SearchResultPComponent from './SearchResultPComponent';
import { useAuth } from '../userContext';

const SearchComponent = ({ onClose, isOpen }) => {
  const { currentUser , setCurrentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null); // State to store search result

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      console.log(`Searching for: ${searchQuery}`);
      let user = await findUserWUsername(searchQuery);
      setSearchResult(user[1]); // Store the search result in state
    } catch (error) {
      console.error(error);
    }
  };

  const handleFollow = (UTBF) => {
    if (!currentUser.following.includes(UTBF)) {
      // Add the follow relationship in the database
      addFollow(currentUser.username, UTBF);
  
      const new_following = [...currentUser.following, UTBF];
      setCurrentUser({
        ...currentUser,
        following: new_following
      });
  
      console.log("Follow complete");
    } else {
      console.log("Already following this user");
    }
  };
  
  return (
    <div className={`search-component ${isOpen ? 'open' : ''}`}>
      <button className="close-button" onClick={onClose}>X</button>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={currentUser ? "Search for a user..." : "Please login to search"}
          disabled = {!currentUser}
        />
        <button type="submit" disabled = {!currentUser}>Search</button>
      </form>

      {/* Render search result if it exists */}
      {searchResult && (
        <SearchResultPComponent userInfo={searchResult} onFollow={handleFollow} />
      )}
    </div>
  );
};

export default SearchComponent;