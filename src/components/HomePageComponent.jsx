import React, { useRef, useState, useEffect } from "react";
import CreatePost from "./CreatePostComponent";
import Navbar from "./NavbarComponent";
import Feed from "./FeedComponent";
import "../Sass/Home.scss";
import { Link } from "react-router-dom";
import { useAuth } from "../userContext";
import { createPostinDB, findUserWUsername, getPostwUsername } from "../api/DataBaseAPI";

const HomePageComponent = () => {
  const { currentUser } = useAuth();
  
  const [followingArray, setFollowingArray] = useState([]); // Array containing followers
  const [followingPostMap, setFollowingPostMap] = useState({});
  const [amountPosts, setAmountPosts] = useState(0);
  const [postsList, setPostList] = useState([]);
  const [createPost, setCreatePost] = useState(false);
  const hasFetchedPosts = useRef(false);

  const initialize = () => {
    if (currentUser && currentUser.following) {//if userissetup
      const following = [...currentUser.following, currentUser.username];//this might not work
      setFollowingArray(following); 
      
    } else {
      console.log("The user has not logged in");
    }
  };
  useEffect(() => {
    initializeFollowingPostMap(followingArray)
  }, [followingArray])
  
  

  useEffect(() => {
    if (!hasFetchedPosts.current && Object.keys(followingPostMap).length > 0) {
      retrieveNextPost(5);
      hasFetchedPosts.current = true; // Set the ref to true after the first call
    }
  }, [followingPostMap]);

  useEffect(() => {
    initialize();
  }, [currentUser]);

  const initializeFollowingPostMap = async (followingArray) => {
    const postMap = {};
    for (let user of followingArray) {
      try {
        let userinfo = await findUserWUsername(user);
        postMap[user] = userinfo[1].posts_created || 0;//if they have something otherwise do zer0
      } catch (error) {
        console.error(`Error fetching user info for ${user}:`, error);//this is a nice error
      }
    }
    setFollowingPostMap(postMap);
  };

  const logUserInfo = () => {
    console.log("User Info:", currentUser);
    console.log("Following Array:", followingArray);
    console.log("Posts List:", postsList);
    console.log("Following Post Map:", followingPostMap);
  };

  const toggleCreatePost = () => {
    setCreatePost(!createPost);
  };

  const CreateNewPost = (PostContent) => {
    const newPost = {
      author: currentUser.username,
      timestamp: Date.now(),
      content: PostContent.content,
      likes: 0,
      id: amountPosts,
    };
    createPostinDB(currentUser.email, PostContent.content);
    setPostList((postsList) => [...postsList, newPost]);
    setAmountPosts(amountPosts + 1);
    setCreatePost(false);
  };

  const retrieveNextPost = async (amount) => {
    try {
      console.log("retrieving the next post")
      console.log("the following array: ", followingArray)
      console.log("The following post amount map: ",  followingPostMap)
      let newPosts = [];
      for (let i = 0; i < amount; i++) {
        let randomIndex = Math.floor(Math.random() * followingArray.length);
        let person = followingArray[randomIndex];

        if (person && followingPostMap[person] - i > 0) {
          let newPost = await getPostwUsername(person, followingPostMap[person] - i);
          console.log("The post returned: ", newPost); 
          console.log("The post id that was searched for", followingPostMap[person])
          newPosts.push(newPost);
        }
        else {
          console.log(`${person} has no more posts`)
        }
      }
      setPostList((postsList) => [...postsList, ...newPosts]);
      return true
    } catch (error) {
      console.error("Error retrieving posts:", error);
    }
  };

  return (
    <div className="home-page">
      <Navbar />
      {createPost && <CreatePost onClose={toggleCreatePost} onSubmit={CreateNewPost} />}
      <Feed postList={postsList} getPosts={retrieveNextPost} />
      <p>Homepage in progress</p>
      <p>I've also decided to make the feed a separate element because that's easier.</p>
      <button onClick={logUserInfo}>Press to log user info</button>
      {!createPost && (
        <button className="new-post" onClick={toggleCreatePost}>
          Create Post? 👀
        </button>
      )}
      <Link to={"/login"}>Login</Link>
    </div> 
  );
};

export default HomePageComponent;
