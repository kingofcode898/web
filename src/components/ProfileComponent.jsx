import React, { useState , useEffect} from 'react';
import '../Sass/Profile.scss';
import Navbar from './NavbarComponent';
import { useAuth } from '../userContext';
import { uploadProfilePicture } from '../api/DataBaseAPI';
import { Link } from 'react-router-dom';

function ProfileComponent() {
  const { currentUser, setCurrentUser } = useAuth();
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');  

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
  
      try {
        // Assuming handlesubmit is an async function that returns the URL
        const pfpURL = await handlesubmit(selectedFile);
  
        // Correct object spread and property assignment
        let updatedUser = {
          ...currentUser,
          profilePictureUrl: pfpURL 
        };
  
        setCurrentUser(updatedUser)
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handlesubmit = (file) => {
    if (!file || !currentUser.username) {
      console.error("File or username is not defined");
      return;
    }
  
    const fileExtension = file.name.split('.').pop();
    const filename = `${currentUser.username}_profile_pic.${fileExtension}`;
  
    uploadProfilePicture(filename, file, currentUser.ID); 
    setUploadMessage('File uploaded successfully!');
  };

  return (
    <>
      <Navbar />
      {currentUser.username ? (
        <div className="profile-page">
          <div className="profile-header">
            <img
              className="profile-picture"
              src={currentUser.profilePictureURL ? currentUser.profilePictureURL : "/blankprofile.png"}
              alt="Profile"
            />
            <div className="profile-details">
              <h1 className="username">{currentUser.username}</h1>
              <div className="stats">
                <span>{currentUser.num_followers} Followers</span>
                <span>{currentUser.num_following} Following</span>
                <span>{currentUser.postsCount || 0} Posts</span>
              </div>
              <p className="bio">{currentUser.bio || "This user has not added a bio yet."}</p>
              <div className="profile-actions">
                <input type="file" accept=".jpg" onChange={handleFileChange} className="upload-input" />
                {uploadMessage && <p className="upload-message">{uploadMessage}</p>}
              </div>
            </div>
          </div>
          <div className="profile-content">
            {/* Placeholder for user posts or other content */}
            <h2>User Posts</h2>
            <div className="posts-grid">
              {/* Map over user's posts and display them here */}
            </div>
          </div>
        </div>
      ) : (
        <div className="side-screen">
          <p>Please log in to view your profile.</p>
          <Link to="/login">Log in</Link>
        </div>
      )}
    </>
  );
}

export default ProfileComponent;