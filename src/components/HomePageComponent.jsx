// HomePageComponent.jsx
import React, { useContext, useState, useEffect } from 'react';
import CreatePost from './createPostComponent';
import Navbar from './NavbarComponent';
import Feed from './FeedComponent';
import "../Sass/Home.scss";
import { Link } from 'react-router-dom';
import { useAuth } from '../userContext'; 

const HomePageComponent = () => {
  //toggle the creat post component
  //make sure user informstion is loaded
  const { currentUser } = useAuth()
  const [postsList, setPostList] = useState([])
  const [createPost, setCreatePost] = useState(false)

  const logUserInfo = () => { 
    console.log(currentUser)
    console.log(postsList)
  }

  const toggleCreatePost = () => { 
    setCreatePost(true)
  }

  const CreateNewPost = (content) => { 
    const newPost = {
      author: currentUser.username, 
      timestamp: 1, 
      content: content.content, 
      likes: 0, 
    }
    setPostList((postsList) => [...postsList, newPost]);
  }
  

  return (
    <div className="home-page">
      <Navbar/>
      {createPost && <CreatePost onClose={toggleCreatePost} onSubmit= { CreateNewPost } />} {/* Conditionally render the component by short circuiting the rendering*/}
      <Feed postList={ postsList } />
      <p>HOmepage in progress</p>
      <p>Ive also decided to make the feed a seperate element becuase thats easier</p>
      <button onClick={logUserInfo}> Press to log user thing to thing </button>
      <button className='new-post' onClick={toggleCreatePost}>Create Post? 👀</button>
      <Link to={'/login'}>Login </Link>
    </div>
    
  );
};

export default HomePageComponent;
