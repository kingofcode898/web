import React, { useState } from 'react';
import Post from './postComponent';
import CreatePost from './createPostComponent';
import { useUser } from '../userContext'

const HomePageComponent = () => {
  const [posts, setPosts] = useState([]);
  const [isCreatePostVisible, setIsCreatePostVisible] = useState(false);
  const { user } = useUser(); // Assuming the user context provides user information

  const handleCreatePost = (post) => {
    // Append the author information to the post before adding it to the state
    const postWithAuthor = { ...post, author: user };
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
