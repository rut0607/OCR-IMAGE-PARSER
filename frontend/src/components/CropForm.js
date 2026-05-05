import React from 'react';

function CropForm({ params, onChange, onSubmit, loading }) {
  const fields = ['x', 'y', 'width', 'height'];

  return (
    <form className="crop-form" onSubmit={onSubmit}>
      <div className="fields">
        {fields.map((field) => (
          <label key={field}>
            {field}
            <input
              type="number"
              name={field}
              value={params[field]}
              min={field === 'width' || field === 'height' ? 1 : 0}
              onChange={onChange}
              required
            />
          </label>
        ))}
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Cropping…' : 'Crop Image'}
      </button>
    </form>
  );
}

export default CropForm;