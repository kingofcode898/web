import React from 'react';
import Post from './postComponent';
import { addComment, addLikeToPost, removeLikeToPost } from '../api/DataBaseAPI';
import { useAuth } from '../userContext';

const Feed = ({ postList }) => {

  const {currentUser} = useAuth(); 

  const handleLike = (postId) => {

    addLikeToPost(postId)
    console.log("The post has been liked");
  };

  const handleRemoveLike = (postId) => {
    removeLikeToPost(postId); 
    console.log("The post has had a like removed");
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
          onRemoveLike = {() => handleRemoveLike(post.id)}
        />
      ))}
    </div>
  );
};

export default Feed;