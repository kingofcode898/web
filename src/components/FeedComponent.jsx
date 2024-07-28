// FeedComponent.jsx
import React, { useEffect, useState } from 'react';
import { db } from './firebase'; // Ensure the path is correct
import Post from './Post';

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const postsCollection = await db.collection('posts').get();
      setPosts(postsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchPosts();
  }, []);

  const handleLike = (postId) => {
    // Implement like functionality
  };

  const handleComment = (postId, comment) => {
    // Implement comment functionality
  };

  return (
    <div className="posts-list">
      {posts.map((post) => (
        <Post
          key={post.id}
          author={post.author}
          content={post.content}
          likes={post.likes}
          timestamp={post.timestamp}
          onLike={() => handleLike(post.id)}
          onComment={(comment) => handleComment(post.id, comment)}
        />
      ))}
    </div>
  );
};

export default Feed;