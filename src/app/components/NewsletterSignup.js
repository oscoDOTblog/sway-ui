'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './NewsletterSignup.module.css';

export default function NewsletterSignup({ project }) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setSubmitStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setMessage('');

    try {
      const response = await fetch('/api/newsletter-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus('success');
        setMessage(data.message);
        setEmail('');
      } else {
        setSubmitStatus('error');
        setMessage(data.message);
      }
    } catch {
      setSubmitStatus('error');
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    if (submitStatus) {
      setSubmitStatus(null);
      setMessage('');
    }
  };

  // Extract colors from the gradient for the overlay
  const getOverlayGradient = (gradient) => {
    // Extract the first color from the gradient
    const colorMatch = gradient.match(/#[a-fA-F0-9]{6}/);
    const primaryColor = colorMatch ? colorMatch[0] : '#667eea';
    
    // Create a semi-transparent overlay using the project's primary color
    return `linear-gradient(
      135deg,
      ${primaryColor}80 0%,
      ${primaryColor}40 50%,
      rgba(0, 0, 0, 0.6) 100%
    )`;
  };

  return (
    <div className={styles.slideContainer}>
      {/* Background Image */}
      <div className={styles.backgroundImage}>
        <Image
          src={project.backgroundImage}
          alt={project.title}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div 
          className={styles.overlay} 
          style={{
            background: getOverlayGradient(project.gradient)
          }}
        />
      </div>
      
      {/* Content */}
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.category}>{project.category}</div>
          <div className={styles.title}>{project.title}</div>
        </div>
        
        <div className={styles.description}>
          {project.description}
        </div>
        
        <div className={styles.signupSection}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <input
                type="email"
                value={email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className={`${styles.input} ${submitStatus === 'error' ? styles.error : ''}`}
                disabled={isSubmitting}
              />
              <button
                type="submit"
                className={`${styles.submitButton} ${isSubmitting ? styles.submitting : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className={styles.spinner}>
                    <div className={styles.spinnerInner}></div>
                  </div>
                ) : (
                  'Subscribe'
                )}
              </button>
            </div>
            
            {message && (
              <div className={`${styles.message} ${styles[submitStatus]}`}>
                {message}
              </div>
            )}
          </form>
        </div>
        
        <div className={styles.iconContainer}>
          <span className={styles.icon}>{project.icon}</span>
        </div>
      </div>
    </div>
  );
} 