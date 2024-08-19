import React, { useRef, useState, useEffect, useCallback } from "react";
import CreatePost from "./createPostComponent";
import Navbar from "./NavbarComponent";
import Feed from "./FeedComponent";
import "../Sass/Home.scss";
import { Link } from "react-router-dom";
import { useAuth } from "../userContext";
import { createPostinDB, findUserWUsername, getPostwUsername } from "../api/DataBaseAPI";

const HomePageComponent = () => {
  const { currentUser } = useAuth();

  const [followingArray, setFollowingArray] = useState([]);
  const [followingPostMap, setFollowingPostMap] = useState({});
  const [amountPosts, setAmountPosts] = useState(0);
  const [postsList, setPostList] = useState([]);
  const [createPost, setCreatePost] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true); // Tracks if there are more posts to load
  const observer = useRef();

  const hasFetchedPosts = useRef(false);

  const initialize = () => {
    if (currentUser && currentUser.following) {
      const following = [...currentUser.following, currentUser.username];
      setFollowingArray(following);
    } else {
      console.log("The user has not logged in");
    }
  };

  useEffect(() => {
    initializeFollowingPostMap(followingArray);
  }, [followingArray]);

  useEffect(() => {
    if (!hasFetchedPosts.current && Object.keys(followingPostMap).length > 0) {
      retrieveNextPost(5);
      hasFetchedPosts.current = true;
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
        postMap[user] = userinfo[1].posts_created || 0;
      } catch (error) {
        console.error(`Error fetching user info for ${user}:`, error);
      }
    }
    setFollowingPostMap(postMap);
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
      let newPosts = [];
      let updatedPostMap = { ...followingPostMap };

      for (let i = 0; i < amount; i++) {
        let randomIndex = Math.floor(Math.random() * followingArray.length);
        let person = followingArray[randomIndex];

        if (person && updatedPostMap[person] > 0) {
          let newPost = await getPostwUsername(person, updatedPostMap[person]);
          updatedPostMap[person] -= 1;
          newPosts.push(newPost);
        } else {
          console.log(`${person} has no more posts.`);
        }
      }

      setFollowingPostMap(updatedPostMap);
      setPostList((postsList) => [...postsList, ...newPosts]);

      if (newPosts.length < amount) {
        setHasMorePosts(false); // No more posts to load
      }
    } catch (error) {
      console.error("Error retrieving posts:", error);
    }
  };

  const lastPostElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMorePosts) {
          retrieveNextPost(5);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMorePosts, followingArray, followingPostMap]
  );

  return (
    <>
      <Navbar />
      <div className="home-page">
        <div className="feed-container">
          {createPost && <CreatePost onClose={toggleCreatePost} onSubmit={CreateNewPost} />}
          <Feed postList={postsList} getPosts={retrieveNextPost} />
          {  !currentUser && <p>Please login to see/create posts</p>}
          <div className="post-end">
            {!hasMorePosts && <p>You have reached the end of the available posts.</p>}
          </div>
        </div>

        { currentUser  && (
          <div className="new-post-container">
            <button className="new-post" onClick={toggleCreatePost}>
              Create Post? 👀
            </button>
          </div>
        )}

        { !currentUser && (
          <div className="login-btn-home">
            <Link to={"/login"}>Login</Link>
          </div>
        )}

        {hasMorePosts && (
          <div ref={lastPostElementRef} className="loading">
            Loading more posts...
          </div>
        )}
      </div>
    </>
  );
};

export default HomePageComponent;