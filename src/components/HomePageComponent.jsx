import React, { useContext, useState } from 'react';
import Post from './postComponent';
import CreatePost from './createPostComponent';
import Navbar from './NavbarComponent';
import { getUserDocument } from '../api/DataBaseAPI';
import { UserContext } from '../userContext';

const HomePageComponent = () => {
  const [posts, setPosts] = useState([]);
  const [isCreatePostVisible, setIsCreatePostVisible] = useState(false);
  const userID = useContext(UserContext); 
  
  const getUsername = async () => {
    const userInfo = await getUserDocument(userID[0]);
    console.log(userInfo)
    const username = userInfo.username; 
    return username
  }
  

  const handleCreatePost = async (post) => {
    // Append the author information to the post before adding it to the state
    const username = await getUsername(); 
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
      <button onClick={handleCreatePostToggle}>Create Post</button>

      {/* Show CreatePost component only if isCreatePostVisible is true */}
      {isCreatePostVisible && (
        <CreatePost onSubmit={handleCreatePost} onClose={handleCreatePostToggle} />
      )}

      {posts.map((post, index) => (
        <Post key={index} author={post.author} content={post.content} />
      ))}
    </div>
  );
};

export default HomePageComponent;
