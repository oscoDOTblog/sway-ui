'use client';

import { useState } from 'react';
import styles from './ImageRegenerationModal.module.css';
import { AI_IMAGE_MODELS, DEFAULT_AI_IMG_MODEL } from '../../config/blogConfig.js';

export default function ImageRegenerationModal({ 
  isOpen, 
  onClose, 
  blogPost, 
  onRegenerate 
}) {
  const [selectedModel, setSelectedModel] = useState(DEFAULT_AI_IMG_MODEL);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState(null);

  const defaultPrompt = `anime graffiti street style, ${blogPost?.title || 'blog post'}, vibrant colors, dynamic composition, high quality, detailed`;

  const handleRegenerate = async () => {
    if (!blogPost) return;

    setIsRegenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/blog/regenerate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': 'admin-authenticated',
        },
        body: JSON.stringify({
          slug: blogPost.slug,
          model: selectedModel,
          customPrompt: customPrompt.trim() || null
        }),
      });

      const data = await response.json();

      if (data.success) {
        onRegenerate(data.newImageUrl);
        onClose();
      } else {
        setError(data.error || 'Failed to regenerate image');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Error regenerating image:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleClose = () => {
    if (!isRegenerating) {
      setSelectedModel(DEFAULT_AI_IMG_MODEL);
      setCustomPrompt('');
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>🔄 Regenerate Blog Image</h2>
          <button 
            className={styles.closeButton}
            onClick={handleClose}
            disabled={isRegenerating}
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.blogInfo}>
            <h3>{blogPost?.title}</h3>
            <p className={styles.slug}>/{blogPost?.slug}</p>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="model-select">AI Model:</label>
            <select
              id="model-select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className={styles.select}
              disabled={isRegenerating}
            >
              {AI_IMAGE_MODELS.map(model => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="prompt-input">Custom Prompt (Optional):</label>
            <textarea
              id="prompt-input"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder={defaultPrompt}
              className={styles.textarea}
              rows={4}
              disabled={isRegenerating}
            />
            <p className={styles.helpText}>
              Leave empty to use the default prompt: "{defaultPrompt}"
            </p>
          </div>

          {error && (
            <div className={styles.error}>
              <p>{error}</p>
            </div>
          )}

          <div className={styles.actions}>
            <button
              className={styles.cancelButton}
              onClick={handleClose}
              disabled={isRegenerating}
            >
              Cancel
            </button>
            <button
              className={styles.regenerateButton}
              onClick={handleRegenerate}
              disabled={isRegenerating}
            >
              {isRegenerating ? (
                <>
                  <span className={styles.spinner}>🔄</span>
                  Regenerating...
                </>
              ) : (
                '🔄 Regenerate Image'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
