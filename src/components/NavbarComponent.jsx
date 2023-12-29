import React from 'react';
import '../Sass/Navbar.scss';

const Navbar = () => {
  return (
    <div className='navbar'>
      <div className='navItem'>
        <a href="/">Home</a>
      </div>
      <div className='navItem'>
        <a href="/profile">Profile</a>
      </div>
      <div className='navItem'>
        <a href="/new-post">New Post</a>
      </div>
    </div>
  );
};

export default Navbar;
