// postComponent.jsx
import React from 'react';
import PropTypes from 'prop-types';
import '../Sass/Post.scss';

const Post = ({ author, content, timestamp, likes, comments, onLike, onComment }) => {
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
        <button onClick={onLike}>Like ({likes})</button>
      </div>
      <div className="post-comments">
        <h4>Comments:</h4>
        <ul>
          {comments.map((comment, index) => (
            <li key={index} className='comment'>{comment}</li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="Add a comment..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onComment(e.currentTarget.value);
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
  timestamp: PropTypes.string.isRequired,
  likes: PropTypes.number.isRequired,
  comments: PropTypes.array.isRequired,
  onLike: PropTypes.func.isRequired,
  onComment: PropTypes.func.isRequired,
};

export default Post;
