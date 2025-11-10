import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';

function ImageCropper({ imageSrc, onCropComplete }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState(null);

  const onCropChange = useCallback((crop) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom) => {
    setZoom(zoom);
  }, []);

  const onCropCompleteCallback = useCallback(async (croppedArea, croppedAreaPixels) => {
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const croppedUrl = URL.createObjectURL(croppedBlob);
      setCroppedImage(croppedUrl);
      
      onCropComplete({
        croppedImageBlob: croppedBlob,
        coordinates: croppedAreaPixels
      });
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  }, [imageSrc, onCropComplete]);

  return (
    <div style={{ width: '100%' }}>
      <p className="cropper-instructions">
        Drag and resize the selection area to choose the region you want to highlight
      </p>
      <div className="cropper-container">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={undefined}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropCompleteCallback}
          cropShape="rect"
          style={{
            containerStyle: {
              width: '100%',
              height: '100%',
              position: 'relative'
            },
            cropAreaStyle: {
              border: '2px solid #1a1a1a',
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.4)'
            }
          }}
        />
      </div>
      <div className="zoom-control">
        <div style={{ flex: 1 }}>
          <label className="zoom-label">Zoom</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="zoom-slider"
          />
        </div>
        <div className="zoom-value">
          {zoom.toFixed(1)}x
        </div>
      </div>
      {croppedImage && (
        <div className="crop-confirmation">
          <p className="crop-confirmation-text">Crop area selected. Ready to process.</p>
        </div>
      )}
    </div>
  );
}

export default ImageCropper;
