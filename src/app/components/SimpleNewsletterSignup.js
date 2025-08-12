'use client';

import { useState } from 'react';
import styles from './SimpleNewsletterSignup.module.css';

export default function SimpleNewsletterSignup() {
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

  return (
    <div className={styles.newsletterContainer}>
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
  );
}
