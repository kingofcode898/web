import React from 'react';
import Post from './postComponent';
import { addComment, toggleLike } from '../api/DataBaseAPI';
import { useAuth } from '../userContext';

const Feed = ({ postList, handleDeletePost }) => {

  const {currentUser} = useAuth(); 

  const handleLike = (postId) => {
    toggleLike(postId, currentUser.id); 
  }

  const handleComment = (postId, comment) => {
    addComment(postId, currentUser.username)
    console.log('this will handle a post comment');
  };

  return (
    <div className="posts-list">
      {postList.map((post) => (
        <Post
          key={post.author + post.num_key}
          postID = {post.id}
          author={post.author}
          caption={post.caption}
          likes={post.likes}
          timestamp={post.timestamp}
          authorpfp={post.authorpfp}
          onLike={() => handleLike(post.id)}
          photourlArray={post.photoUrls}
          onComment={(comment) => handleComment(post.id, comment)}
          onDelete={()=> handleDeletePost(post.id)}
        />
      ))}
    </div>
  );
};

export default Feed;