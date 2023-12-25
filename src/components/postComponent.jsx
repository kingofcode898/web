import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Post = ({ author, content }) => {
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const timestamp = new Date().toLocaleString();

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleComment = (comment) => {
    setComments([...comments, comment]);
  };

  return (
    <div className="post">
      <div className="post-header">
        <p>{author}</p>
        <p>{timestamp}</p>
      </div>
      <div className="post-content">
        <p>{content}</p>
      </div>
      <div className="post-actions">
        <button onClick={handleLike}>Like ({likes})</button>
      </div>
      <div className="post-comments">
        <h4>Comments:</h4>
        <ul>
          {comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="Add a comment..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleComment(e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
        />
      </div>
    </div>
  );
};

Post.propTypes = {
  author: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default Post;