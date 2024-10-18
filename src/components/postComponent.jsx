import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "../Sass/Post.scss";
import { useAuth } from "../userContext";
import { useNavigate } from "react-router-dom";

const Post = ({
  author,
  caption,
  likes,
  onLike,
  onComment,
  timestamp,
  authorpfp,
  postID,
  onDelete,
  photourlArray }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate(); 
  const [showMenu, setShowMenu] = useState(false);
  const [liked, setLiked] = useState(false);
  const [numLikes, setNumLikes] = useState(likes);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [commentContent, setCommentContent] = useState("");

  const toggleOptions = () => {
    setShowMenu(!showMenu);
  };

  const handleProfileClick = () => {
    navigate(`/user/${author}`);
  };
  const formatTimestamp = (seconds) => {
    const date = new Date(seconds * 1000); // Convert seconds to milliseconds
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    return date.toLocaleDateString('en-US', options).replace(',', '');
  }
  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setNumLikes((prevNumLikes) => prevNumLikes + (newLiked ? 1 : -1));
    onLike(postID);
  };

  const handleCommentChange = (event) => setCommentContent(event.target.value);

  const handleComment = () => {
    onComment(commentContent);
    console.log("Comment button pressed");

  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photourlArray.length);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + photourlArray.length) % photourlArray.length
    );
  };

  const handleDelete = () => {
    onDelete();
  };

  return (
    <div className="post">
      <div className="post-header" >
        <img
          src={authorpfp ? authorpfp : "/blankprofile.png"}
          className="post-pfp"
          alt="Profile"
          onClick={handleProfileClick}
        />
        <p onClick={handleProfileClick}>{author}</p>
        <p>{formatTimestamp(timestamp)}</p>
      </div>
      <div className="post-photo-carousel">
        <div className="post-carousel">
          <img
            src={photourlArray[currentIndex]}
            alt={`Preview ${currentIndex + 1}`}
            className="post-carousel-image"
          />
          {photourlArray.length > 1 && (
            <>
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
            </>
          )}
        </div>
      </div>
      <div className="post-caption">
        <p>{caption}</p>
      </div>
      <div className="post-like">
        <div className="toggle">
          <button
            className={`like-button ${liked ? "liked" : ""}`}
            onClick={handleLike}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24px"
              height="24px"
              className="heart-icon"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill={liked ? "#ed4956" : "#ccc"}
              />
            </svg>
          </button>
        </div>
        <div className="post-like-count">{numLikes}</div>
        <div className="post-three-dot-menu">
          {currentUser.username === author && (
            <button onClick={toggleOptions} className="post-three-dot-button">
              ⋮
            </button>
          )}
          {showMenu && (
            <div className="post-dropdown-menu">
              <button className="post-delete" onClick={handleDelete}>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="comment-section">
        <p>comments:</p>
        <div className="comment-box-container">
          <textarea
            className="comment-box"
            placeholder="Add a comment..."
            onChange={handleCommentChange}
          />
          <button className="upload-button" onClick={handleComment}>
            Upload
          </button>
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
