import React from 'react';


function FollowListComponent({ type, users, onClose }) {
  return (
    <div className="follow-list-overlay">
      <div className="follow-list-container">
        <div className="follow-list-header">
          <h2>{type === 'followers' ? 'Followers' : 'Following'}</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <ul className="follow-list">
          {users.length > 0 ? (
            users.map((user) => (
              <li key={user.id} className="follow-list-item">
                <img
                  src={user.profilePictureUrl || '/blankprofile.png'}
                  alt={user.username}
                  className="follow-list-avatar"
                />
                <span className="follow-list-username">{user.username}</span>
              </li>
            ))
          ) : (
            <p className="no-users">No users found.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default FollowListComponent;