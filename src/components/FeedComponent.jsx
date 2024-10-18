import React from 'react';
import Post from './postComponent';
import { addComment, toggleLike } from '../api/DataBaseAPI';
import { useAuth } from '../userContext';

const Feed = ({ postList, handleDeletePost }) => {

  const {currentUser} = useAuth(); 

  const handleLike = (postId) => {
    toggleLike(postId, currentUser.id, currentUser.username); 
  }

  const handleComment = (postId, comment) => {
    addComment(postId, currentUser.username, currentUser.id, comment)
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
          likes={post.likesCount ? post.likesCount : 0}
          timestamp={post.timestamp ? post.timestamp : post.createdAt.seconds } 
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