import React from 'react';

function ImageUploader({ onFileSelect, previewUrl }) {
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) onFileSelect(file);
  };

  return (
    <div className="uploader">
      <label htmlFor="image-input">Choose image (JPG or PNG)</label>
      <input
        id="image-input"
        type="file"
        accept="image/jpeg, image/png"
        onChange={handleChange}
      />
      {previewUrl && (
        <div className="preview">
          <p>Preview:</p>
          <img src={previewUrl} alt="Uploaded preview" />
        </div>
      )}
    </div>
  );
}

export default ImageUploader;