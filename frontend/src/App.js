import React, { useState } from 'react';
import ImageUploader  from './components/ImageUploader';
import CropForm       from './components/CropForm';
import ResultImage    from './components/ResultImage';
import ExtractUploader from './components/ExtractUploader';
import './App.css';

function App() {
  const [tab, setTab] = useState('extract');

  const [file,       setFile]       = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [params,     setParams]     = useState({ x:0, y:0, width:100, height:100 });
  const [resultUrl,  setResultUrl]  = useState('');
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');

  const handleFileSelect = (f) => {
    setFile(f);
    setResultUrl('');
    setError('');
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleParamChange = (e) => {
    setParams(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError('Please upload an image first.'); return; }
    setLoading(true);
    setError('');
    setResultUrl('');

    const formData = new FormData();
    formData.append('image',  file);
    formData.append('x',      params.x);
    formData.append('y',      params.y);
    formData.append('width',  params.width);
    formData.append('height', params.height);

    try {
      const res = await fetch('http://localhost:5001/api/crop', {
        method: 'POST',
        body  : formData
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Something went wrong.');
      }
      const blob = await res.blob();
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Image processing tool</h1>

      <div className="tabs">
        <button
          className={tab === 'extract' ? 'tab active' : 'tab'}
          onClick={() => setTab('extract')}
        >
          Extract to JSON
        </button>
        <button
          className={tab === 'crop' ? 'tab active' : 'tab'}
          onClick={() => setTab('crop')}
        >
          Crop image
        </button>
      </div>

      {tab === 'extract' && <ExtractUploader />}

      {tab === 'crop' && (
        <>
          <ImageUploader onFileSelect={handleFileSelect} previewUrl={previewUrl} />
          <CropForm
            params={params}
            onChange={handleParamChange}
            onSubmit={handleSubmit}
            loading={loading}
          />
          {error && <p className="error">{error}</p>}
          <ResultImage url={resultUrl} />
        </>
      )}
    </div>
  );
}

export default App;