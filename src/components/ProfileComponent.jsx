import React, { useState, useEffect } from 'react';
import '../Sass/Profile.scss';
import Navbar from './NavbarComponent';
import { useAuth } from '../userContext';
import { uploadProfilePicture, updateUserBio, getUserPosts } from '../api/DataBaseAPI';
import ProfilePostComponent from './ProfilePostComponent';
import { Link } from 'react-router-dom';

function ProfileComponent() {
  const { currentUser, setCurrentUser } = useAuth();
  const [file, setFile] = useState(null);
  const [showMenu, setShowMenu] = useState(false); // For toggling the three-dot menu
  const [showPFPChanger, setShowPFPChanger] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [showBioInput, setShowBioInput] = useState(false);
  const [newBio, setNewBio] = useState(currentUser?.bio || "");
  const [userPosts, setUserPosts] = useState([]); 

  useEffect(() => {
    if (currentUser) {
      const fetchPosts = async () => {
        try {
          const posts = await getUserPosts(currentUser.id);
          setUserPosts(posts);
        } catch (error) {
          console.error('Error fetching user posts:', error);
        }
      };
      fetchPosts();
    }
  }, [currentUser]);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      try {
        await handleSubmit(selectedFile);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleSubmit = async (file) => {
    if (!file || !currentUser.username) {
      console.error("File or username is not defined");
      return;
    }

    const fileExtension = file.name.split('.').pop();
    const filename = `${currentUser.username}_profile_pic.${fileExtension}`;

    try {
      const url = await uploadProfilePicture(filename, file, currentUser.ID);
      setUploadMessage('File uploaded successfully!');

      const updatedUser = {
        ...currentUser,
        profilePictureUrl: url,
      };

      setCurrentUser(updatedUser);

      const userInfoString = JSON.stringify(updatedUser);
      localStorage.setItem("user-info", userInfoString);
    } catch (error) {
      console.error('Error during the file upload process:', error);
    }
  };

  const toggleMenu = () => setShowMenu(!showMenu);

  const toggleProfilePicChanger = () => {
    setShowPFPChanger(!showPFPChanger);
    setShowMenu(false);
  };

  const toggleBioInput = () => {
    setShowBioInput(!showBioInput);
    setShowMenu(false);
  };

  const handleBioChange = (event) => setNewBio(event.target.value);

  const saveBio = () => {
    changeBio(newBio);
    setShowBioInput(false);
  };

  const changeBio = (newBio) => {
    updateUserBio(currentUser.ID, newBio);
    const updatedUser = {
      ...currentUser,
      bio: newBio,
    };
    setCurrentUser(updatedUser);
    const userInfoString = JSON.stringify(updatedUser);
    localStorage.setItem("user-info", userInfoString);
  };

  return (
    <>
      <Navbar />
      {currentUser ? (
        <div className="profile-page">
          <div className="profile-header">
            <img
              className="profile-picture"
              src={currentUser.profilePictureUrl ? currentUser.profilePictureUrl : "/blankprofile.png"}
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

              <div className="three-dot-menu">
                <button onClick={toggleMenu} className="three-dot-button">⋮</button>
                {showMenu && (
                  <div className="dropdown-menu">
                    <button onClick={toggleBioInput}>Edit Bio</button>
                    <button onClick={toggleProfilePicChanger}>Change Profile Picture</button>
                  </div>
                )}
              </div>

              {showBioInput && (
                <div className="bio-input-container">
                  <input
                    type="text"
                    value={newBio}
                    onChange={handleBioChange}
                    placeholder="Enter your bio"
                    className="bio-input"
                  />
                  <button onClick={saveBio} className="save-bio-bttn">Save</button>
                </div>
              )}

              {showPFPChanger && (
                <div className="profile-actions">
                  <input
                    type="file"
                    accept=".jpg"
                    onChange={handleFileChange}
                    className="upload-input"
                  />
                  {uploadMessage && <p className="upload-message">{uploadMessage}</p>}
                </div>
              )}
            </div>
          </div>
          <div className="profile-content">
            <h2>User Posts</h2>
            <div className="posts-grid">
              {userPosts.map((post) => (
                <ProfilePostComponent
                  key={post.id}
                  author={post.author}
                  caption={post.caption}
                  likes={post.likes}
                  onLike={(postID) => console.log(`Liked post ${postID}`)}
                  onComment={() => console.log('Commented')}
                  timestamp={new Date(post.createdAt.seconds * 1000).toLocaleDateString()}
                  authorpfp={post.authorpfp}
                  postID={post.id}
                  onDelete={() => console.log(`Deleted post ${post.id}`)}
                  photourlArray={post.photoUrls}
                  onRemoveLike={(postID) => console.log(`Removed like from post ${postID}`)}
                />
              ))}
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