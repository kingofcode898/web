// HomePageComponent.jsx
import React, { useContext, useState, useEffect } from 'react';
import CreatePost from './createPostComponent';
import Navbar from './NavbarComponent';
import Feed from './FeedComponent';
import { UserContext } from '../userContext';
import "../Sass/Home.scss";
import { createPostinDB, getUserPosts } from '../api/DataBaseAPI';

const HomePageComponent = () => {
  
  const [isCreatePostVisible, setIsCreatePostVisible] = useState(false);


  return (
    <div className="home-page">
      <Navbar />
      <button onClick={setIsCreatePostVisible(false)} className='new-post'>Create Post</button>

      {/* Show CreatePost component only if isCreatePostVisible is true */}
      {isCreatePostVisible && (
        <CreatePost onSubmit={handleCreatePost} onClose={handleCreatePostToggle} />
      )}
      <Feed/>
    </div>
    
  );
};

export default HomePageComponent;
