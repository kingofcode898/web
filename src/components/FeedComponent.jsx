// FeedComponent.jsx
import React, { useEffect, useState } from 'react';
import { firestore } from '../firebaseConfig';
import Post from './postComponent';

const Feed = ({ postList }) => {

  const handleLike = (postId) => {
    // Implement like functionality
    console.log()
  };

  const handleComment = (postId, comment) => {
    // Implement comment functionality
    console.log('this will handel a post comment ')
  };

  return (
    <div className="posts-list">
     fwwds
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