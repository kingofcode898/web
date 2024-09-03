import React, { useState } from 'react';
import '../Sass/Navbar.scss';
import Logo from "../assets/cross1.png";
import { Link } from 'react-router-dom';
import { useAuth } from '../userContext';
import SearchComponent from './SearchComponent';
import glass from "/mglass.svg";
import home from "/home.svg";
import create from "/create.svg";

const Navbar = ({ toggleCreatePost }) => {
  const { currentUser } = useAuth();
  const [showSearch, setShowSearch] = useState(false);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  return (
    <div className='navbar'>
      <img src={Logo} className='Logo' alt="Logo" />
      <div className='navItem'>
        <Link className="link" to="/">
          <img src={home} height="40px" alt="Home" />
          <span className='navText'>Home</span>
        </Link>
      </div>
      <div className='navItem'>
        <Link className="link" to="/profile">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            width="24"
            height="24"
            aria-label="Profile Icon"
          >
            <title>Profile</title>
            <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
          </svg>
          <span className='navText'>Profile</span>
        </Link>
      </div>
      <div className='navItem' onClick={toggleSearch}>
        <div className='search-toggle'>
          <img src={glass} height="40px" alt="Search" />
          <span className='navText'>Search</span>
        </div>
      </div>
      <div className='navItem' onClick={toggleCreatePost}>
        <div className=''>
          <img src={create} height="35px" alt="Create" />
          <span className='navText'>Create</span>
        </div>
      </div>
      <div className='navItem'>
        <img 
          src={(currentUser && currentUser.profilePictureUrl) ? currentUser.profilePictureUrl : "/blankprofile.png"} 
          className='nav-pfp' 
          alt="Profile" 
        />
      </div>
      {showSearch && <SearchComponent onClose={toggleSearch} isOpen={showSearch} />}
    </div>
  );
};

export default Navbar;