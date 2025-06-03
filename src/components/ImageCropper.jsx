import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

export default function ImageCropper({
  imageSrc,
  aspect = 4 / 3,
  onCancel,
  onCropCompleteConfirm,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  // Confirm cropping with the selected area
  const handleConfirm = () => {
    if (croppedAreaPixels) {
      onCropCompleteConfirm(croppedAreaPixels);
    }
  };

  // Skip cropping, use the full image
  const handleUseOriginal = () => {
    onCropCompleteConfirm(null); // parent should handle this case!
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="relative bg-white p-6 rounded-2xl shadow-2xl w-full max-w-xl flex flex-col items-center">
        <h2 className="text-lg font-bold mb-4">Crop Image</h2>
        <div className="w-full h-96 bg-gray-900 rounded-xl relative">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>
        <div className="flex gap-4 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded-lg text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleUseOriginal}
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Use Original Image
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Crop &amp; Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
