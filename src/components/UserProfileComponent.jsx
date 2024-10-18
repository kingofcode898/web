import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../Sass/UserProfile.scss';
import Navbar from './NavbarComponent';
import { useAuth } from '../userContext';
import { findUserByUsername, getUserPosts, addFollow } from '../api/DataBaseAPI';
import ProfilePostComponent from './ProfilePostComponent';

function UserProfileComponent() {
  const { username } = useParams();
  const { currentUser, setCurrentUser } = useAuth();
  const [user, setUser] = useState(null); // The user whose profile we're viewing
  const [userPosts, setUserPosts] = useState([]);
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userArray = await findUserByUsername(username);
        const userData = userArray[1];
        const userId = userArray[0];
        setUser({ id: userId, ...userData });

        if (currentUser && currentUser.following.includes(username)) {
          setFollowed(true);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUser();
  }, [username, currentUser]);

  useEffect(() => {
    if (user) {
      const fetchPosts = async () => {
        try {
          const posts = await getUserPosts(user.id);
          setUserPosts(posts);
        } catch (error) {
          console.error('Error fetching user posts:', error);
        }
      };
      fetchPosts();
    }
  }, [user]);

  const handleFollow = async () => {
    if (!currentUser) {
      console.log('Please log in to follow users.');
      return;
    }
    try {
      if (!followed) {
        await addFollow(currentUser.username, user.username);
        setFollowed(true);
        const updatedUser = {
          ...currentUser,
          following: [...currentUser.following, user.username],
          num_following: currentUser.num_following + 1,
        };
        setCurrentUser(updatedUser);
        localStorage.setItem('user-info', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div>Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="user-profile-page">
        <div className="user-profile-header">
          <img
            className="user-profile-picture"
            src={user.profilePictureUrl ? user.profilePictureUrl : '/blankprofile.png'}
            alt="Profile"
          />
          <div className="user-profile-details">
            <h1 className="user-username">{user.username}</h1>
            <div className="user-stats">
              <span>{user.num_followers} Followers</span>
              <span>{user.num_following} Following</span>
              <span>{user.posts_created || 0} Posts</span>
            </div>
            <p className="user-bio">{user.bio || 'No bio yet.'}</p>
            {currentUser && currentUser.username !== user.username && (
              <button onClick={handleFollow} className="user-follow-button">
                {followed ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        </div>
        <div className="user-profile-content">
          <h2>User Posts</h2>
          <div className="user-posts-grid">
            {userPosts.map((post) => (
              <ProfilePostComponent
                key={post.id}
                author={post.author}
                caption={post.caption}
                likes={post.likes}
                onLike={(postID) => console.log(`Liked post ${postID}`)}
                onComment={() => console.log('Commented')}
                timestamp={post.createdAt.seconds}
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
    </>
  );
}

export default UserProfileComponent;