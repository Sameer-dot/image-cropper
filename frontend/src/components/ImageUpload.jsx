import React, { useRef } from 'react';

function ImageUpload({ onImageSelect }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    onImageSelect(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="upload-area"
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <div className="upload-icon">📷</div>
      <h2 className="upload-title">Upload Image</h2>
      <p className="upload-subtitle">Click to select or drag and drop</p>
      <p className="upload-formats">JPG, PNG, WebP, GIF</p>
    </div>
  );
}

export default ImageUpload;
