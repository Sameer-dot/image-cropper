import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import ImageCropper from './components/ImageCropper';
import ColorPicker from './components/ColorPicker';

const DEFAULT_BORDER_COLOR = '#000000';
const DEFAULT_BORDER_WIDTH = 3;

function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [cropData, setCropData] = useState(null);
  const [borderColor, setBorderColor] = useState(DEFAULT_BORDER_COLOR);
  const [borderWidth, setBorderWidth] = useState(DEFAULT_BORDER_WIDTH);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageSelect = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setOriginalFile(file);
      setCropData(null);
      setResultImage(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (data) => {
    setCropData(data);
  };

  const handleProcessImage = async () => {
    if (!originalFile || !cropData) {
      setError('Please select an image and define a crop area');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('originalImage', originalFile);
      formData.append('croppedImage', cropData.croppedImageBlob, 'cropped.jpg');
      formData.append('cropX', cropData.coordinates.x.toString());
      formData.append('cropY', cropData.coordinates.y.toString());
      formData.append('cropWidth', cropData.coordinates.width.toString());
      formData.append('cropHeight', cropData.coordinates.height.toString());
      formData.append('borderColor', borderColor);
      formData.append('borderWidth', borderWidth.toString());

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/process-image`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process image');
      }

      const data = await response.json();
      
      if (!data.imageUrl) {
        throw new Error('Server did not return an image URL');
      }
      
      setResultImage(data.imageUrl);
    } catch (err) {
      setError(err.message || 'An error occurred while processing the image');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!resultImage) return;

    try {
      const response = await fetch(resultImage);
      if (!response.ok) {
        throw new Error('Failed to fetch image for download');
      }
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `processed-image-${Date.now()}.jpeg`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(`Failed to download image: ${err.message}`);
    }
  };

  const handleReset = () => {
    setImageSrc(null);
    setOriginalFile(null);
    setCropData(null);
    setResultImage(null);
    setError(null);
    setBorderColor(DEFAULT_BORDER_COLOR);
    setBorderWidth(DEFAULT_BORDER_WIDTH);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="app-header">
        <h1>Image Editor</h1>
        <p>Upload, crop, and add custom borders to your images</p>
      </div>

      {!imageSrc ? (
        <div className="card">
          <ImageUpload onImageSelect={handleImageSelect} />
        </div>
      ) : (
        <>
          <div className="card">
            <h2 className="section-title">Select Region</h2>
            <ImageCropper
              imageSrc={imageSrc}
              onCropComplete={handleCropComplete}
            />
          </div>

          <div className="card">
            <h2 className="section-title">Border Settings</h2>
            <div className="border-settings">
              <div className="input-group" style={{ marginBottom: 0 }}>
                <ColorPicker
                  color={borderColor}
                  onChange={setBorderColor}
                />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Border Width</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={borderWidth}
                  onChange={(e) => setBorderWidth(parseInt(e.target.value) || DEFAULT_BORDER_WIDTH)}
                  style={{ width: '120px' }}
                />
                <span style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>pixels</span>
              </div>
              <div className="controls-group">
                <button
                  onClick={handleProcessImage}
                  disabled={loading || !cropData}
                  className="btn btn-primary"
                >
                  {loading && <span className="loading-spinner"></span>}
                  {loading ? 'Processing...' : 'Process Image'}
                </button>
                <button
                  onClick={handleReset}
                  className="btn btn-secondary"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {resultImage && (
            <div className="card result-section">
              <div className="result-header">
                <h2 className="section-title" style={{ margin: 0 }}>Result</h2>
                <button
                  onClick={handleDownload}
                  className="btn btn-success"
                >
                  Download Image
                </button>
              </div>
              <div className="result-image-container">
                <img
                  src={resultImage}
                  alt="Processed result"
                  onError={() => {
                    setError('Failed to load processed image. Please try processing again.');
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
