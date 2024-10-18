import React, { useRef, useState, useEffect, useCallback } from "react";
import CreatePost from "./createPostComponent";
import Navbar from "./NavbarComponent";
import Feed from "./FeedComponent";
import "../Sass/Home.scss";
import { Link } from "react-router-dom";
import { useAuth } from "../userContext";
import { createPostInDB,  getPost ,deletePost} from "../api/DataBaseAPI";


const HomePageComponent = () => {
  const { currentUser } = useAuth();

  const followingArray = useRef([]);
  const followingPostMap = useRef({});
  const postListRef = useRef([]);

  const currentTime = Date.now()

  const [postsList, setPostList] = useState([]);
  const [createPost, setCreatePost] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  const isInitialized = useRef(false);

  const initialize = useCallback(async () => {
    if (isInitialized.current) return;

    const postMap = {};
    if (currentUser && currentUser.following) {
      const following = [...currentUser.following, currentUser.username];
      for (let user of following) {
        try {
          postMap[user] = currentTime; // Use the timestamp directly
        } catch (error) {
          console.error(`Error setting the time info for ${user}:`, error);
        }
      }
      followingArray.current = following;
      followingPostMap.current = postMap;
      isInitialized.current = true;
      retrieveNextPost(5);
    } else {
      console.log("The user has not logged in");
    }
  }, [currentUser, currentTime]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const toggleCreatePost = () => setCreatePost(!createPost);

  const CreateNewPost = async (PostContent) => {
    let _id = await createPostInDB(
      currentUser.id ? currentUser.id : currentUser.ID,
      PostContent.caption,
      PostContent.photo_urls,
      currentUser.username
    );

    const newPost = {
      author: currentUser.username,
      userId: currentUser.id,
      timestamp: Date.now(),
      caption: PostContent.caption,
      likes: 0,
      num_key: currentUser.posts_created + 1,
      id: _id,
      photoUrls: PostContent.photo_urls,
    };
    console.log(newPost);
    setPostList((prevPosts) => [newPost, ...prevPosts]);

    localStorage.setItem(
      "user-info",
      JSON.stringify({
        ...currentUser,
        posts_created: currentUser.posts_created + 1,
      })
    );
    setCreatePost(false);
  };

  const retrieveNextPost = async (amount = 5) => {
    setIsLoading(true);
    let hasDuplicate = false;

    if (!isInitialized.current || !hasMorePosts) {
      setIsLoading(false);
      return;
    }

    try {
      let newPosts = [];
      let updatedPostMap = { ...followingPostMap.current };
      let index = currentIndex;

      for (let i = 0; i < amount; i++) {
        let person = followingArray.current[index];
        let attempts = 0;

        //while we still have users
        while (attempts < followingArray.current.length) {
          
          //if the followed person has posts to display
          if (person && updatedPostMap[person] !== 0) {
            console.log("This is the seconds:", updatedPostMap[person] )
            
            let newPost = await getPost(person, updatedPostMap[person]);
            
            if (newPost) 
            {
              updatedPostMap[person] =( newPost.postData.createdAt.seconds * 1000)

              if (!postListRef.current.some((post) => post.id === newPost[0])) {
                newPost = {
                  ...newPost.postData,
                  authorpfp: newPost.authorProfilePicture,
                  id: newPost.postId,
                };
                newPosts.push(newPost);
                postListRef.current.push(newPost);
                index = (index + 1) % followingArray.current.length;
              } else {
                console.log("Duplicate spotted");
                hasDuplicate = true;
              }
            } else {
              updatedPostMap[person] = 0; // No more posts available for this user
            }
            break;
          } else {
            console.log(`${person} has no more posts.`);
          }

          index = (index + 1) % followingArray.current.length;
          person = followingArray.current[index];
          attempts++;
        }
        if (attempts === followingArray.current.length) break;
      }

      setCurrentIndex(index);
      followingPostMap.current = updatedPostMap;
      setPostList((prevPosts) => [...prevPosts, ...newPosts]);
      setIsLoading(false);
      if (newPosts.length < amount && !hasDuplicate) setHasMorePosts(false);
    } catch (error) {
      console.error("Error retrieving posts:", error);
      setIsLoading(false);
    }
  };

  const deletePostById = async (postId) => {
    try {
      await deletePost(postId, currentUser.id ? currentUser.id : currentUser.ID); // Assuming this function deletes the post from the database
      setPostList((prevPosts) => prevPosts.filter(post => post.id !== postId));
      console.log(`Post with id ${postId} has been deleted`);
    } catch (error) {
      console.log("Error deleting post:", error);
    }
  };

  return (
    <>
      <Navbar toggleCreatePost={toggleCreatePost} />
      <div className="home-page">
        <div className="feed-container">
          {createPost && (
            <CreatePost onClose={toggleCreatePost} onSubmit={CreateNewPost} />
          )}
          <Feed postList={postsList} handleDeletePost = {deletePostById} />
          <div className="end-of-list">
            <div className="">
              {hasMorePosts ? "" : "You have reached the end of the posts available"}
            </div>
            {hasMorePosts && (
              <button
                className="load-more-post-bttn"
                onClick={() => retrieveNextPost()}
              >
                {isLoading ? "Loading" : "Load more"}
              </button>
            )}
          </div>
        </div>

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