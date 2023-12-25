import React, { useState } from 'react';
import Post from './postComponent';
import CreatePost from './createPostComponent';

const HomePageComponent = () => {
  const [posts, setPosts] = useState([]);

  const handleCreatePost = (post) => {
    setPosts([...posts, post]);
  };

  return (
    <div className="home-page">
      <CreatePost onSubmit={handleCreatePost} />
      {posts.map((post, index) => (
        <Post key={index} author={post.author} content={post.content} />
      ))}
    </div>
  );
};

export default HomePageComponent;
