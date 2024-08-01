import React from 'react';
import '../Sass/Navbar.scss'; 
import Logo from "../assets/cross1.png"
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className='navbar'>
      <img src={Logo} className='Logo'/>
      <div className='navItem'>
      <Link className="link" to="/">Home</Link>
      </div>
      <div className='navItem'>
      <Link className="link" to="/profile">Profile</Link>
      </div>
      <div className='navItem'>
      <Link className="link" to="/mini-games">Mini-games</Link>
      </div>
    </div>
  );
};

export default Navbar;
