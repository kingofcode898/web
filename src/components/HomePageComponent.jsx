// HomePageComponent.jsx
import React, { useContext, useState, useEffect } from 'react';
import Post from './postComponent';
import CreatePost from './createPostComponent';
import Navbar from './NavbarComponent';
import { UserContext } from '../userContext';
import "../Sass/Home.scss";
import { createPostinDB, getUserPosts } from '../api/DataBaseAPI';

const HomePageComponent = () => {
  
  const [posts, setPosts] = useState([]);
  const [isCreatePostVisible, setIsCreatePostVisible] = useState(false);
  const [CurrentUser, setCurrentUser] = useContext(UserContext);

  //Retrive the posts from the database and render them 
  const displayPosts = async () => {
    const postsFromDB = await getUserPosts("Users/" + CurrentUser.ID);
  
    const newPosts = postsFromDB.map((post) => post);
    setPosts(newPosts);
  };

  //Call the display posts function once when the homepage loads
  useEffect(() => {
    displayPosts();
  }, []);


  const loadPosts = async () => {
    //Load the next 3 posts 
    //
    console.log("load posts");
  }; 

  const handleCreatePost = (post) => {
    // Generate a unique ID for the post
    const postID = CurrentUser.ID + (CurrentUser.posts_created + 1)
    const username = CurrentUser.username;
    const postWithAuthor = { ...post, id: postID, author: username, likes: 0, comments: [], timestamp:  Date.now().toString()};
    setPosts([...posts, postWithAuthor]);

    createPostinDB(CurrentUser.email, post.content)
    setIsCreatePostVisible(false);
  };

  const handleCreatePostToggle = () => {
    setIsCreatePostVisible(!isCreatePostVisible);
  };

  const handleLike = (postId) => {
    //
    // Increment the likes count for the specified post
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        // Check if the user has already liked the post
        if (post.likedBy.includes(CurrentUser.ID)) {
          // User has already liked the post, return it as is
          return post;
        } else {
          // User hasn't liked the post, increment likes and add user to likedBy
          return { ...post, likes: post.likes + 1 };
        }
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  const handleComment = (postId, comment) => {
    
    // Add a new comment to the specified post
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, comment] };
      }
      
      return post;
    });
    
    setPosts(updatedPosts);
  };


  return (
    <div className="home-page">
      <Navbar />
      <button onClick={handleCreatePostToggle} className='new-post'>Create Post</button>

      {/* Show CreatePost component only if isCreatePostVisible is true */}
      {isCreatePostVisible && (
        <CreatePost onSubmit={handleCreatePost} onClose={handleCreatePostToggle} />
      )}

      <div className='post-container'>
        {posts.slice().reverse().map((post, index) => (
          <Post
            postId={post.id}
            author={post.author}
            content={post.content}
            timestamp={post.date_created}
            likes={post.likes}
            // comments={post.comments}
            onLike={() => handleLike(post.id)}
            onComment={(comment) => handleComment(post.id, comment)}
          />
        ))}
      </div>
        <div className='load-posts'>
          <button onClick={loadPosts}>Load More Posts</button>
        </div>

    </div>
    
  );
};

export default HomePageComponent;
