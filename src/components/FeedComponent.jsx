// FeedComponent.jsx
import React, { useEffect, useState } from 'react';
import Post from './postComponent';

const Feed = ({ postList }) => {

  const handleLike = (postId) => {
    // Implement like functionality
    console.log("The post has been liked")
  
  };

  const handleComment = (postId, comment) => {
    
    console.log('this will handel a post comment ')
  };


  return (
    <div className="posts-list">
      { postList.map((post) => (
        <Post
          key={post.id} // Use a unique identifier for the key prop
          author={post.author}
          content={post.content}
          likes={post.likes}
          timestamp={post.timestamp}
          onLike={() => handleLike(post.id)} // Pass the unique post ID
          onComment={(comment) => handleComment(post.id, comment)} // Handle comments with dynamic input
        />
      ))}
    </div>
  );
};

export default Feed;