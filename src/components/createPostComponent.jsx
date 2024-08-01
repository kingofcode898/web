import React, { useState } from 'react';
import '../Sass/CreatePost.scss';

const CreatePost = ({ onSubmit, onClose }) => {
  //text content state 
  const [content, setContent] = useState('');
  
  /* The code recives an on Submit function which comes from the homePage component. 
  That function handles creating posts filling it with the content from this create post. */ 
  const handleSubmit = (e) => {
    e.preventDefault();//prevents empty bocx
    onSubmit({ content });//passes the content to the onsubbit
    // Reset the content field
    setContent('');
  };



  return (
    <div className='create-post'>
      <form onSubmit={handleSubmit}>
        <label>
          Content:
          <textarea
            placeholder='Write whats on your mind here...'
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
