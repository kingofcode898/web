// postComponent.jsx
import React from "react";
import PropTypes from "prop-types";
import "../Sass/Post.scss";
import { useState } from "react";

const Post = ({  author,  content,  likes,  comments,onLike, onComment,timestamp}) => 
{
  return (
    <div className="post">
      <div className="post-header">
        <p>{author}</p>
        <p>{timestamp}</p>
      </div>
      <div className="post-content">
        <p>{content}</p>
      </div>
      <div className="post-like">
        <div class="toggle">
          <input type="checkbox" id="heart-check" onClick={onLike} />
          <label for="heart-check" id="heart">
            <svg
              viewBox="0 0 24 22"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <path
                id="initial"
                d="M11.8189091,20.3167303 C17.6981818,16.5505143 20.6378182,12.5122542 20.6378182,8.20195014 C20.6378182,5.99719437 18.8550242,4 16.3283829,4 C13.777264,4 12.5417153,6.29330284 11.8189091,6.29330284 C11.0961029,6.29330284 10.1317157,4 7.30943526,4 C4.90236126,4 3,5.64715533 3,8.20195014 C3,12.5122346 5.93963637,16.5504946 11.8189091,20.3167303 Z"
              ></path>
              <path
                id="stroke"
                fill="none"
                d="M11.8189091,20.3167303 C17.6981818,16.5505143 20.6378182,12.5122542 20.6378182,8.20195014 C20.6378182,5.99719437 18.8550242,4 16.3283829,4 C13.4628072,4 10.284995,6.64162063 10.284995,8.70392731 C10.284995,10.0731789 10.8851209,10.9874447 11.8189091,10.9874447 C12.7526973,10.9874447 13.3528232,10.0731789 13.3528232,8.70392731 C13.3528232,6.64162063 10.1317157,4 7.30943526,4 C4.90236126,4 3,5.64715533 3,8.20195014 C3,12.5122346 5.93963637,16.5504946 11.8189091,20.3167303 Z"
              ></path>
            </svg>
          </label>
        </div>
        <div className="like-count"> Likes: {likes}</div>
      </div>
      <div className="post-comments">
        <h4>Comments:</h4>
        <ul>
          {comments.map((comment, index) => (
            <li key={index} className="comment">
              {comment}
            </li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="Add a comment..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onComment(e.currentTarget.value);
              e.currentTarget.value = "";
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
  likes: PropTypes.number.isRequired,
  comments: PropTypes.array.isRequired,
  onLike: PropTypes.func.isRequired,
  onComment: PropTypes.func.isRequired,
};

export default Post;
