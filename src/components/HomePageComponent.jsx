import React, { useRef, useState, useEffect, useCallback } from "react";
import CreatePost from "./createPostComponent";
import Navbar from "./NavbarComponent";
import Feed from "./FeedComponent";
import "../Sass/Home.scss";
import { Link } from "react-router-dom";
import { useAuth } from "../userContext";
import { createPostinDB, findUserWUsername, getPost } from "../api/DataBaseAPI";

const HomePageComponent = () => {
  const { currentUser } = useAuth();

  const followingArray = useRef([]);
  const followingPostMap = useRef({});
  const postListRef = useRef([])

  const [postsList, setPostList] = useState([]);
  const [createPost, setCreatePost] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [isLoading, setIsLoading] = useState(false)

  const [currentIndex, setCurrentIndex] = useState(0);

  const isInitialized = useRef(false);

  const initialize = useCallback(async () => {
    if (isInitialized.current === true) {
      console.log(isInitialized.current)
      return;
    }

    if (currentUser && currentUser.following) {
      const following = [...currentUser.following, currentUser.username];
      const postMap = {};
      for (let user of following) {
        try {
          let userinfo = await findUserWUsername(user);
          postMap[user] =  userinfo[1].posts_created || 0 ;
        } catch (error) {
          console.error(`Error fetching user info for ${user}:`, error);
        }
      }
      followingArray.current = following
      followingPostMap.current = postMap
      isInitialized.current = true;
      console.log(followingArray.current,followingPostMap.current)

      retrieveNextPost(5)
    } else {
      console.log("The user has not logged in");
    }
  }, [currentUser]);


  useEffect(() => {
    initialize()
  }, [initialize])

  const toggleCreatePost = () => setCreatePost(!createPost);

  
  const CreateNewPost = async (PostContent) => {
    let _id = await createPostinDB(currentUser.ID, PostContent.caption, PostContent.photo_urls,currentUser.username);

    const newPost = {
      author: currentUser.username,
      timestamp: Date.now(),
      caption: PostContent.caption,
      likes: 0,
      num_key: currentUser.posts_created + 1,
      id: _id,
      photo_urls: PostContent.photo_urls
    };

    setPostList((prevPosts) => [newPost, ...prevPosts,]);

    localStorage.setItem("user-info", JSON.stringify({
      ...currentUser, posts_created: currentUser.posts_created + 1,
    }));
    setCreatePost(false);
  };

  const retrieveNextPost = async (amount) => {
    setIsLoading(true)
    let hasDuplicate = false

    if (!isInitialized.current || !hasMorePosts) return;
    amount = 5

    try {
      let newPosts = [];
      let updatedPostMap = { ...followingPostMap.current };
      let index = currentIndex;

      for (let i = 0; i < amount; i++) {
        let person = followingArray.current[index];
        let attempts = 0;
        while (attempts < followingArray.current.length) {
          if (person && updatedPostMap[person] > 0) {
            console.log(person, updatedPostMap[person])
            let newPost = await getPost(person, updatedPostMap[person]);
            updatedPostMap[person] -= 1;
            if (!postListRef.current.some(post => (post.id === newPost[0]) )) {
              newPost = {
                ...newPost[1],
                authorpfp: newPost[2],
                id: newPost[0]
              }
              console.log(newPost)
              newPosts.push(newPost);
              postListRef.current.push(newPost)
              index = (index + 1) % followingArray.current.length;
            } else {
              console.log("duplicate spotted")
              console.log(postListRef)
              hasDuplicate = true

            }
            break;

          } else {
            console.log(`${person} has no more posts.`);
          }

          index = (index + 1) % followingArray.current.length;
          person = followingArray.current[index];
          attempts++;
        }
        if (attempts === followingArray.length) break;
      }

      setCurrentIndex(index);
      followingPostMap.current = updatedPostMap
      setPostList((prevPosts) => [...prevPosts, ...newPosts]);
      setIsLoading(false)
      if (newPosts.length < amount && !hasDuplicate) setHasMorePosts(false);
    } catch (error) {
      console.error("Error retrieving posts:", error);
    }
  };



  return (
    <>
      <Navbar />
      <div className="home-page">
        <div className="feed-container">
          {createPost && <CreatePost onClose={toggleCreatePost} onSubmit={CreateNewPost} />}
          <Feed postList={postsList} />
          <div className="end-of-list">
            <div className="">{hasMorePosts ? "" : "You have reached the end of the posts availible"}</div>
            {hasMorePosts && <button className="load-more-post-bttn" onClick={retrieveNextPost}>{isLoading ? "Loading"  : "Load more" }</button>}
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