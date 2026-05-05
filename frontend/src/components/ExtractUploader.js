import React, { useState } from 'react';

function ExtractUploader() {
  const [file,       setFile]       = useState(null);
  const [preview,    setPreview]    = useState('');
  const [result,     setResult]     = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setError('');
  };

  const handleExtract = async () => {
    if (!file) { setError('Please upload an image first.'); return; }

    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('http://localhost:5001/api/extract', {
        method: 'POST',
        body  : formData
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Extraction failed.');
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: 'application/json'
    });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'extracted_data.json';
    a.click();
  };

  return (
    <div className="extract-section">
      <h2>Extract table data</h2>
      <p className="subtitle">Upload a handwritten table image — Gemini Vision will extract it as JSON automatically.</p>

      <div className="upload-box">
        <label htmlFor="extract-input" className="upload-label">
          Choose image (JPG or PNG)
        </label>
        <input
          id="extract-input"
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleFile}
        />
      </div>

      {preview && (
        <div className="preview-box">
          <p className="label">Preview</p>
          <img src={preview} alt="Uploaded preview" className="preview-img" />
        </div>
      )}

      <button
        onClick={handleExtract}
        disabled={loading || !file}
        className="extract-btn"
      >
        {loading ? 'Extracting…' : 'Extract to JSON'}
      </button>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result-box">
          <div className="result-header">
            <div>
              <p className="label">Extracted data</p>
              {result.date && (
                <p className="date-tag">Date: {result.date}</p>
              )}
            </div>
            <button onClick={handleDownload} className="download-btn">
              Download JSON
            </button>
          </div>

          <div className="table-wrap">
            <table className="result-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Job</th>
                  <th>Sn No</th>
                  <th>Actual weight</th>
                  <th>After core weight</th>
                  <th>Core scrap</th>
                  <th>X and Y</th>
                </tr>
              </thead>
              <tbody>
                {result.rows?.map((row, i) => (
                  <tr key={i}>
                    <td>{row.no        ?? '—'}</td>
                    <td>{row.job       ?? '—'}</td>
                    <td>{row.sn_no     ?? '—'}</td>
                    <td>{row.actual_weight      ?? '—'}</td>
                    <td>{row.after_core_weight  ?? '—'}</td>
                    <td>{row.core_scrap         ?? '—'}</td>
                    <td>{row.x_and_y            ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <details className="raw-json">
            <summary>View raw JSON</summary>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
}

export default ExtractUploader;