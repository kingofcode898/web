import React, { useState } from 'react';
import '../Sass/Navbar.scss'; 
import Logo from "../assets/cross1.png";
import { Link } from 'react-router-dom';
import SearchComponent from './SearchComponent';

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  return (
    <div className='navbar'>
      <img src={Logo} className='Logo' alt="Logo"/>
      <div className='navItem'>
        <Link className="link" to="/">Home</Link>
      </div>
      <div className='navItem'>
        <Link className="link" to="/profile">Profile</Link>
      </div>
      <div className='navItem'>
        <Link className="link" to="/mini-games">Mini-games</Link>
      </div>
      <div className='navItem'>
        <button className="search-button" onClick={toggleSearch}>
          🔍
        </button>
      </div>

      {showSearch && <SearchComponent onClose={toggleSearch} />}
    </div>
  );
};

export default Navbar;
