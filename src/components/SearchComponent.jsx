import React, { useState } from 'react';
import '../Sass/SearchComponent.scss';

const SearchComponent = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(`Searching for: ${searchQuery}`);
    // Implement the search functionality here
  };

  return (
    <div className="search-component">
      <button className="close-button" onClick={onClose}>X</button>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="search for user"
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default SearchComponent;
