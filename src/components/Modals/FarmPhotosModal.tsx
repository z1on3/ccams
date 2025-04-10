"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";

interface FarmPhotosModalProps {
  farmerId: string;
  onClose: () => void;
  onPhotosUpdated: () => void;
}

const FarmPhotosModal = ({ farmerId, onClose, onPhotosUpdated }: FarmPhotosModalProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validate file types
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      toast.error('Please select only image files');
      return;
    }

    setSelectedFiles(validFiles);

    // Create previews
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    setIsUploading(true);
    try {
      // Upload files to /api/upload first
      const uploadedPaths: string[] = [];
      
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload file ${file.name}`);
        }

        const data = await response.json();
        if (!data.path) {
          throw new Error(`No path returned for file ${file.name}`);
        }
        
        uploadedPaths.push(data.path);
      }

      if (uploadedPaths.length === 0) {
        throw new Error('No files were uploaded successfully');
      }

      // Save photo paths to database
      const response = await fetch(`/api/farmers/${farmerId}/photos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ photos: uploadedPaths }),
      });

      if (!response.ok) {
        throw new Error('Failed to save photos');
      }

      const result = await response.json();
      toast.success(`Successfully uploaded ${result.addedCount} photos`, { autoClose: 1000 });
      onPhotosUpdated();
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload photos');
    } finally {
      setIsUploading(false);
    }
  };

  const removePreview = (index: number) => {
    // Clean up the URL object to prevent memory leaks
    URL.revokeObjectURL(previews[index]);
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-999999 flex items-center justify-center bg-black bg-opacity-50">
      <ToastContainer />
      <div className="w-full max-w-xl rounded-lg bg-white p-6 dark:bg-gray-dark">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-dark dark:text-white">Upload Farm Photos</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            multiple
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded bg-primary px-4 py-2 text-white hover:bg-opacity-90"
            disabled={isUploading}
          >
            Select Photos
          </button>
        </div>

        {previews.length > 0 && (
          <div className="mb-4 grid grid-cols-3 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative">
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  width={150}
                  height={150}
                  className="rounded-lg object-cover"
                />
                <button
                  onClick={() => removePreview(index)}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded border border-stroke px-4 py-2 text-dark hover:bg-gray-100 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="rounded bg-primary px-4 py-2 text-white hover:bg-opacity-90"
            disabled={isUploading || previews.length === 0}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmPhotosModal; 