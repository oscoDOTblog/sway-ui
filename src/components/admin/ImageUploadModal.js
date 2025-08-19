'use client';

import { useState, useRef } from 'react';
import styles from './ImageUploadModal.module.css';

export default function ImageUploadModal({ 
  isOpen, 
  onClose, 
  blogPost, 
  onUpload 
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!selectedFile || !blogPost) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('slug', blogPost.slug);

      const response = await fetch('/api/blog/upload-image', {
        method: 'POST',
        headers: {
          'x-admin-password': 'admin-authenticated',
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onUpload(data.imageUrl);
        handleClose();
      } else {
        setError(data.error || 'Failed to upload image');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setError(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      onClose();
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Upload Image for Blog Post</h2>
          <button 
            onClick={handleClose}
            disabled={isUploading}
            className={styles.closeButton}
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.blogInfo}>
            <h3>{blogPost?.title}</h3>
            <p className={styles.slug}>Slug: {blogPost?.slug}</p>
          </div>

          {!selectedFile ? (
            <div 
              ref={dropZoneRef}
              className={styles.dropZone}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={handleBrowseClick}
            >
              <div className={styles.dropZoneContent}>
                <div className={styles.uploadIcon}>📁</div>
                <h3>Upload Image</h3>
                <p>Drag and drop an image here, or click to browse</p>
                <p className={styles.fileInfo}>
                  Supported formats: JPG, PNG, GIF, WebP<br />
                  Max size: 10MB
                </p>
              </div>
            </div>
          ) : (
            <div className={styles.previewContainer}>
              <div className={styles.previewHeader}>
                <h3>Image Preview</h3>
                <button 
                  onClick={() => {
                    setSelectedFile(null);
                    if (previewUrl) {
                      URL.revokeObjectURL(previewUrl);
                      setPreviewUrl(null);
                    }
                  }}
                  className={styles.removeButton}
                >
                  Remove
                </button>
              </div>
              <div className={styles.preview}>
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className={styles.previewImage}
                />
                <div className={styles.fileDetails}>
                  <p><strong>File:</strong> {selectedFile.name}</p>
                  <p><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  <p><strong>Type:</strong> {selectedFile.type}</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              ❌ {error}
            </div>
          )}

          <div className={styles.actions}>
            <button 
              onClick={handleClose}
              disabled={isUploading}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button 
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className={styles.uploadButton}
            >
              {isUploading ? (
                <>
                  <div className={styles.spinner}></div>
                  Uploading...
                </>
              ) : (
                'Upload Image'
              )}
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}
