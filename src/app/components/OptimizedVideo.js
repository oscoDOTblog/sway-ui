'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './OptimizedVideo.module.css';

export default function OptimizedVideo({ 
  src, 
  poster, 
  fallbackText = "Video Demo",
  className = "" 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Start loading 50px before visible
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleVideoLoad = () => {
    setIsLoaded(true);
  };

  const handleVideoError = () => {
    setHasError(true);
  };

  return (
    <div 
      className={`${styles.videoContainer} ${className}`} 
      ref={containerRef}
    >
      {isVisible && !hasError ? (
        <video
          ref={videoRef}
          className={styles.video}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
        >
          <source src={src} type="video/webm" />
          <source src={src.replace('.webm', '.mp4')} type="video/mp4" />
        </video>
      ) : null}
      
      {/* Loading state */}
      {isVisible && !isLoaded && !hasError && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
          <p>Loading video...</p>
        </div>
      )}
      
      {/* Fallback state */}
      {(!isVisible || hasError) && (
        <div className={styles.videoPlaceholder}>
          <div className={styles.placeholderContent}>
            <span className={styles.placeholderIcon}>🎥</span>
            <p>{fallbackText}</p>
            {hasError && <span className={styles.errorText}>Video unavailable</span>}
          </div>
        </div>
      )}
    </div>
  );
}
