// postComponent.jsx
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import "../Sass/Post.scss";
import { useAuth } from "../userContext";
import { useState } from "react";

const Post = ({ author, caption, likes, onLike, onComment, timestamp, authorpfp, postID, onDelete, photourlArray, onRemoveLike}) => {
  const { currentUser } = useAuth()

  const [showMenu, setShowMenu] = useState(false);
  const [liked, setLiked] = useState(false); // State to track if the post is liked
  const [numLikes, setNumLikes] = useState(likes)
  const [currentIndex, setCurrentIndex] = useState(0);

  const toggleOptions = () => {
    setShowMenu(!showMenu)
  }

  const handleLike = () => {
    setNumLikes((prevNumLikes) => prevNumLikes + (liked ? -1 : 1));

    if(liked){
      onRemoveLike(postID)
    }else{
      onLike(postID)
    }
    setLiked(!liked)
    
  };

  const handleComment = () => {
    onComment()
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % (photourlArray.length));
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + (photourlArray.length)) % (photourlArray.length));
  };

  return (
    <div className="post">
      <div className="post-header">
        <img src={authorpfp ? authorpfp : "/blankprofile.png"} className="post-pfp" alt="Profile" />
        <p>{author}</p>
        <p>{timestamp}</p>
      </div>
      <div className="post-photo-carousel">
        <div className="post-carousel">
          <img
            src={photourlArray[currentIndex]}
            alt={`Preview ${currentIndex + 1}`}
            className="post-carousel-image"
          />
          {photourlArray.length > 1 && <>
            <button
              type="button"
              className="post-carousel-button prev"
              onClick={goToPrevious}
              aria-label="Previous Image"
            >
              ‹
            </button>
            <button
              type="button"
              className="post-carousel-button next"
              onClick={goToNext}
              aria-label="Next Image"
            >
              ›
            </button>
          </>}

        </div>
      </div>
      <div className="post-caption">
        <p>{caption}</p>
      </div>
      <div className="post-like">
        <div className="toggle">
          <button className={`like-button ${liked ? 'liked' : ''}`} onClick={handleLike}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24px"
              height="24px"
              className="heart-icon"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill={liked ? '#ed4956' : '#ccc'}
              />
            </svg>
          </button>
        </div>
        <div className="post-like-count"> {numLikes}</div>
        <div className="post-three-dot-menu">
          {(currentUser.username === author) && <button onClick={toggleOptions} className="post-three-dot-button">⋮</button>}
          {showMenu && (
            <div className="post-dropdown-menu">
              <button className="post-delete" onClick={onDelete}>Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


Post.propTypes = {
  photourlArray: PropTypes.array.isRequired,
  author: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  likes: PropTypes.number.isRequired,
  postID: PropTypes.string.isRequired,
  onLike: PropTypes.func.isRequired,
  onComment: PropTypes.func.isRequired,
};

export default Post;
