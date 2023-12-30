import React from 'react';
import '../Sass/Navbar.scss'; 
import Logo from "../assets/cross1.png"

const Navbar = () => {
  return (
    <div className='navbar'>
      <img src={Logo} className='Logo'/>
      <div className='navItem'>
        <a href="/">Home</a>
      </div>
      <div className='navItem'>
        <a href="/profile">Profile</a>
      </div>
    </div>
  );
};

export default Navbar;
