import React, { useState } from 'react';
import '../Sass/CreatePost.scss';
import { uploadPostPicture } from '../api/DataBaseAPI';

const CreatePost = ({ onSubmit, onClose }) => {
  const [caption, setCaption] = useState('');
  const [photoFiles, setPhotoFiles] = useState([]);
  const [previewSrcs, setPreviewSrcs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleCaptionChange = (e) => setCaption(e.target.value);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotoFiles([...photoFiles, ...files]);

    const filePreviews = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePreviews).then((previews) => {
      setPreviewSrcs([...previewSrcs, ...previews]);
      setCurrentIndex(previewSrcs.length);
    });
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % (previewSrcs.length + 1));
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + (previewSrcs.length + 1)) % (previewSrcs.length + 1));
  };

  const removeImage = (index) => {
    const newFiles = photoFiles.filter((_, i) => i !== index);
    const newPreviews = previewSrcs.filter((_, i) => i !== index);
    setPhotoFiles(newFiles);
    setPreviewSrcs(newPreviews);
    if (currentIndex >= newPreviews.length) setCurrentIndex(newPreviews.length - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const uploadPromises = photoFiles.map(async (file) => {
        const filename = `${Date.now()}_${file.name}`;
        return await uploadPostPicture(filename, file);
      });

      const photoUrls = await Promise.all(uploadPromises);
      onSubmit({ caption, photo_urls: photoUrls });
      setCaption('');
      setPhotoFiles([]);
      setPreviewSrcs([]);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="create-post-background" onClick={onClose}></div>
      <div className='create-post'>
        <form onSubmit={handleSubmit}>
          <div className="upload-photo-carousel">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              multiple
              style={{ display: 'none' }}
              id="file-input"
            />
            <div className="carousel">
              {currentIndex < previewSrcs.length ? (
                <>
                  <img
                    src={previewSrcs[currentIndex]}
                    alt={`Preview ${currentIndex + 1}`}
                    className="carousel-image"
                  />
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => removeImage(currentIndex)}
                  >
                    ✕
                  </button>
                </>
              ) : (
                <div
                  className="upload-photo-button"
                  onClick={() => document.getElementById('file-input').click()}
                >
                  <div className="plus-icon">+</div>
                </div>
              )}
              {previewSrcs.length > 0 && (
                <>
                  <button
                    type="button"
                    className="carousel-button prev"
                    onClick={goToPrevious}
                    aria-label="Previous Image"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="carousel-button next"
                    onClick={goToNext}
                    aria-label="Next Image"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          </div>

          <label>
            Caption:
            <textarea
              placeholder="Add a caption..."
              value={caption}
              onChange={handleCaptionChange}
              required
            />
          </label>

          <div className='form-buttons'>
          <button type="button" onClick={onClose} disabled={uploading}>
              Close
            </button>
            <button type="submit" disabled={uploading}>
              {uploading ? 'Creating Post...' : 'Create Post'}
            </button>
            
          </div>
        </form>
      </div>
    </>
  );
};

export default CreatePost;