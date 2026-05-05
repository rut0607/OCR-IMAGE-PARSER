import React from 'react';

function ResultImage({ url }) {
  if (!url) return null;
  return (
    <div className="result">
      <p>Cropped result:</p>
      <img src={url} alt="Cropped output" />
      <a href={url} download="cropped.png">Download</a>
    </div>
  );
}

export default ResultImage;