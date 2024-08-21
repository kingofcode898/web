import React, { useState } from 'react';
import '../Sass/Profile.scss';
import Navbar from './NavbarComponent';
import { useAuth } from '../userContext';
import { uploadProfilePicture, updateUserBio } from '../api/DataBaseAPI';
import { Link } from 'react-router-dom';

function ProfileComponent() {
  const { currentUser, setCurrentUser } = useAuth();
  const [file, setFile] = useState(null);
  const [showPFPChanger, setShowPFPChanger] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [showBioInput, setShowBioInput] = useState(false);
  const [newBio, setNewBio] = useState(currentUser?.bio || "");

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      try {
        const pfpURL = await handlesubmit(selectedFile);

        let updatedUser = {
          ...currentUser,
          profilePictureURL: pfpURL,
        };
        
        const userInfoString = JSON.stringify(updatedUser);
        localStorage.setItem("user-info", userInfoString)

      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handlesubmit = async (file) => {
    if (!file || !currentUser.username) {
      console.error("File or username is not defined");
      return;
    }

    const fileExtension = file.name.split('.').pop();
    const filename = `${currentUser.username}_profile_pic.${fileExtension}`;

    let url = await uploadProfilePicture(filename, file, currentUser.ID);
    setUploadMessage('File uploaded successfully!');
    return url;
  };

  const toggleProfilePicChanger = () => {
    setShowPFPChanger(!showPFPChanger);
  };

  const toggleBioInput = () => {
    setShowBioInput(!showBioInput);
  };

  const handleBioChange = (event) => {
    setNewBio(event.target.value);
  };

  const saveBio = () => {
    changeBio(newBio);
    setShowBioInput(false);
  };

  const changeBio = (newBio) => {
    updateUserBio(currentUser.ID, newBio);

    setCurrentUser({
      ...currentUser,
      bio: newBio,
    });
  };

  return (
    <>
      <Navbar />
      {currentUser ? (
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
                <span>{currentUser.posts_created || 0} Posts</span>
              </div>
              <p className="bio">{currentUser.bio || "Add a bio..."}</p>
              <button onClick={toggleBioInput} className='toggle-bio-input'>
                {showBioInput ? "Cancel" : "Edit Bio"}
              </button>
              {showBioInput && (
                <div className="bio-input-container">
                  <input
                    type="text"
                    value={newBio}
                    onChange={handleBioChange}
                    placeholder="Enter your bio"
                    className="bio-input"
                  />
                  <button onClick={saveBio} className="save-bio-button">Save</button>
                </div>
              )}
              <div className="profile-actions">
                <button onClick={toggleProfilePicChanger} className="toggle-pfp-button">
                  {showPFPChanger ? "Cancel" : "Change Profile Picture"}
                </button>
                {showPFPChanger && (
                  <input
                    type="file"
                    accept=".jpg"
                    onChange={handleFileChange}
                    className="upload-input"
                  />
                )}
                {uploadMessage && <p className="upload-message">{uploadMessage}</p>}
              </div>
            </div>
          </div>
          <div className="profile-content">
            <h2>User Posts</h2>
            <div className="posts-grid">
              {/* The user posts will be mapped and displayed here when the photo part is done */}
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