// HomePageComponent.jsx
import React, { useContext, useState, useEffect } from "react";
import CreatePost from "./createPostComponent";
import Navbar from "./NavbarComponent";
import Feed from "./FeedComponent";
import "../Sass/Home.scss";
import { Link } from "react-router-dom";
import { useAuth } from "../userContext";
import { createPostinDB, getUserPosts } from "../api/DataBaseAPI";

const HomePageComponent = () => {
  //toggle the creat post component
  //make sure user informstion is loaded
  const { currentUser } = useAuth();
  const { followingArray } = currentUser.following;
  const [amountPosts, setAmountPosts] = useState(0);
  const [postsList, setPostList] = useState([]);
  const [createPost, setCreatePost] = useState(false);

  const onStart = () => {
    followingArray.push(currentUser.username)
    setUserPostMap();
    retriveNextPost(5); 
  }

  const setUserPostMap = () => {
    for(let i = 0; i < followingArray.size(); i++){
      
    }
  }
  const logUserInfo = () => {
    console.log(currentUser);
    console.log(postsList);
  };

  const toggleCreatePost = () => {
    setCreatePost(!createPost);
  };

  const CreateNewPost = (PostContent) => {
    const newPost = {
      author: currentUser.username,
      timestamp: 1,
      content: PostContent.content,
      likes: 0,
      id: amountPosts
    };
    createPostinDB(currentUser.email, PostContent.content);
    setPostList((postsList) => [...postsList, newPost]);
    setAmountPosts(amountPosts + 1);
    setCreatePost(false)
  };

  const retriveNextPost = async (amount) => {
    try {
      for(let i = 0; i < amount; i++){
        let  randomIndex = Math.floor(Math.random() * followingArray.length);
        person = followingArray[randomIndex]; 

        //get the post 
        //add the post to the list of posts

        newPost = await getUserPost(person, ID )
        setPostList((postList => [...postList, newPost]))
      }
      
    } catch (error) {
      
    }
  }

  return (
    <div className="home-page">
      <Navbar />
      {createPost && <CreatePost onClose={toggleCreatePost} onSubmit={CreateNewPost} />}
      {/* Conditionally render the component by short circuiting the rendering*/}
      <Feed postList={postsList} getPosts={retriveNextPost} />
      <p>HOmepage in progress</p>
      <p>
        Ive also decided to make the feed a seperate element becuase thats
        easier
      </p>
      <button onClick={logUserInfo}> Press to log user thing to thing </button>
      {!createPost && (
        <button className="new-post" onClick={toggleCreatePost}>
          Create Post? 👀
        </button>
      )}
      <Link to={"/login"}>Login </Link>
    </div>
  );
};

export default HomePageComponent;
