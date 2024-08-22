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
  const [postsList, setPostList] = useState([]);
  const [createPost, setCreatePost] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const observer = useRef();
  const isInitialized = useRef(false);

  const initialize = useCallback(async () => {
    if (currentUser && currentUser.following) {
      const following = [...currentUser.following, currentUser.username];
      const postMap = {};
      for (let user of following) {
        try {
          let userinfo = await findUserWUsername(user);
          postMap[user] = userinfo[1].posts_created || 0;
        } catch (error) {
          console.error(`Error fetching user info for ${user}:`, error);
        }
      }
      setFollowingArray(following);
      setFollowingPostMap(postMap);
      isInitialized.current = true;
    } else {
      console.log("The user has not logged in");
    }
  }, [currentUser]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isInitialized.current && Object.keys(followingPostMap).length > 0) {
      retrieveNextPost(5);
    }
  }, [followingPostMap]);

  const toggleCreatePost = () => setCreatePost(!createPost);

  const CreateNewPost = (PostContent) => {
    const newPost = {
      author: currentUser.username,
      timestamp: Date.now(),
      content: PostContent.content,
      likes: 0,
      id: currentUser.posts_created + 1,
    };
    
    createPostinDB(currentUser.email, PostContent.content);
    setPostList((prevPosts) => [newPost, ...prevPosts,]);
    
    localStorage.setItem("user-info", JSON.stringify({
      ...currentUser, posts_created: currentUser.posts_created + 1,
    }));
    setCreatePost(false);
  };

  const retrieveNextPost = async (amount) => {
    if (!isInitialized.current || !hasMorePosts) return;

    try {
      let newPosts = [];
      let updatedPostMap = { ...followingPostMap };
      let index = currentIndex;

      for (let i = 0; i < amount; i++) {
        let person = followingArray[index];

        let attempts = 0;
        while (attempts < followingArray.length) {
          if (person && updatedPostMap[person] > 0) {
            let newPost = await getPostwUsername(person, updatedPostMap[person]);
            updatedPostMap[person] -= 1;
            newPosts.push(newPost);
            break;
          } else {
            console.log(`${person} has no more posts.`);
          }

          index = (index + 1) % followingArray.length;
          person = followingArray[index];
          attempts++;
        }

        if (attempts === followingArray.length) break;
      }

      setCurrentIndex(index);
      setFollowingPostMap(updatedPostMap);
      setPostList((prevPosts) => [...prevPosts, ...newPosts]);

      if (newPosts.length < amount) setHasMorePosts(false);
    } catch (error) {
      console.error("Error retrieving posts:", error);
    }
  };

  const endOfListRef = useCallback((node) => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMorePosts) {
        console.log("End of list in view, loading more posts...");
        retrieveNextPost(5);
      }
    });

    if (node) observer.current.observe(node);
  }, [hasMorePosts, retrieveNextPost]);

  return (
    <>
      <Navbar />
      <div className="home-page">
        <div className="feed-container">
          {createPost && <CreatePost onClose={toggleCreatePost} onSubmit={CreateNewPost} />}
          <Feed postList={postsList} />
          <div ref={endOfListRef} className="end-of-list">
            {hasMorePosts ? "Loading more posts..." : "You have reached the end of the available posts."}
          </div>
        </div>

        {currentUser && (
          <div className="new-post-container">
            <button className="new-post" onClick={toggleCreatePost}>
              Create Post? 👀
            </button>
          </div>
        )}

        {!currentUser && (
          <div className="login-btn-home">
            <Link to={"/login"}>Login</Link>
          </div>
        )}
      </div>
    </>
  );
};

export default HomePageComponent;