// HomePageComponent.jsx
import React, { useContext, useState } from 'react';
import Post from './postComponent';
import CreatePost from './createPostComponent';
import Navbar from './NavbarComponent';
import { UserContext } from '../userContext';
import "../Sass/Home.scss";

const HomePageComponent = () => {
  const [posts, setPosts] = useState([]);
  const [isCreatePostVisible, setIsCreatePostVisible] = useState(false);
  const [CurrentUser, setCurrentUser] = useContext(UserContext);

  const handleCreatePost = (post) => {
    // Generate a unique ID for the post
    const postId = Date.now().toString();
    const username = CurrentUser.username;
    const postWithAuthor = { ...post, id: postId, author: username, likes: 0, comments: [] };
    setPosts([...posts, postWithAuthor]);
    // Hide the CreatePost component
    setIsCreatePostVisible(false);
  };

  const handleCreatePostToggle = () => {
    // Toggle the visibility of the CreatePost component
    setIsCreatePostVisible(!isCreatePostVisible);
  };

  const handleLike = (postId) => {
    // Increment the likes count for the specified post
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
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
            key={index}
            postId={post.id}
            author={post.author}
            content={post.content}
            timestamp={post.timestamp}
            likes={post.likes}
            comments={post.comments}
            onLike={() => handleLike(post.id)}
            onComment={(comment) => handleComment(post.id, comment)}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePageComponent;
