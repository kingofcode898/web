import React, { useState } from 'react';
import '../Sass/CreatePost.scss';

const CreatePost = ({ onSubmit, onClose }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ content });
    // Reset form fields
    setContent('');
  };

  return (
    <div className='window'>
      <form onSubmit={handleSubmit}>
        <label>
          Content:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </label>
        <div>
          <button type="submit">Create Post</button>
          <button type="button" onClick={onClose}>Close</button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
