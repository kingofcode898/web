import React, { useContext, useState } from 'react';
import Post from './postComponent';
import CreatePost from './createPostComponent';
import Navbar from './NavbarComponent';
import { UserContext } from '../userContext';
import "../Sass/Home.scss"

const HomePageComponent = () => {
  const [posts, setPosts] = useState([]);
  const [isCreatePostVisible, setIsCreatePostVisible] = useState(false);
  const [CurrentUser, setCurrentUser] = useContext(UserContext); 
  

  const handleCreatePost =  (post) => {
    // Append the author information to the post before adding it to the state
    const username = CurrentUser.username; 
    const postWithAuthor = { ...post, author: username };
    console.log(username)
    setPosts([...posts, postWithAuthor]);
    // Hide the CreatePost component
    setIsCreatePostVisible(false);
  };

  const handleCreatePostToggle = () => {
    // Toggle the visibility of the CreatePost component
    setIsCreatePostVisible(!isCreatePostVisible);
  };

  return (
    
    <div className="home-page">
      <Navbar/>
      <button onClick={handleCreatePostToggle} className='new-post'>Create Post</button>

      {/* Show CreatePost component only if isCreatePostVisible is true */}
      {isCreatePostVisible && (
        <CreatePost onSubmit={handleCreatePost} onClose={handleCreatePostToggle} />
      )}

      <div className='post-container'>
      {posts.slice().reverse().map((post, index) => (
        <Post key={index} author={post.author} content={post.content} />
      ))}
      </div>
      
    </div>
  );
};

export default HomePageComponent;
