import React from 'react';
import Post from './postComponent';

const Feed = ({ postList }) => {

  const handleLike = (postId) => {
    // Implement like functionality
    console.log("The post has been liked");
  };

  const handleComment = (postId, comment) => {
    console.log('this will handle a post comment');
  };

  return (
    <div className="posts-list">
      {postList.map((post) => (
        <Post
          key={post.id}
          author={post.author}
          content={post.content}
          likes={post.likes}
          timestamp={post.timestamp}
          onLike={() => handleLike(post.id)}
          onComment={(comment) => handleComment(post.id, comment)}
        />
      ))}
    </div>
  );
};

export default Feed;