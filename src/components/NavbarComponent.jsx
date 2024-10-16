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
      <img src={Logo} className='nav-Logo' alt="Logo" />
      <div className='navItem'>
        <Link className="link" to="/">
          <img src={home} height="40px" alt="Home" />
          <span className='navText'>Home</span>
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
        <Link className="link" to="/profile">
          <img 
          src={(currentUser && currentUser.profilePictureUrl) ? currentUser.profilePictureUrl : "/blankprofile.png"} 
          className='nav-pfp' 
          alt="Profile" 
          />
          <span className='navText'>{(currentUser && currentUser.username ) ? currentUser.username : "profile"}</span>
          </Link>
      </div>
      {showSearch && <SearchComponent onClose={toggleSearch} isOpen={showSearch} />}
    </div>
  );
};

export default Navbar;