'use client';

import { useState } from 'react';
import styles from './AnimatedForm.module.css';

export default function AnimatedForm() {
  const [formData, setFormData] = useState({
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setError('');
        setFormData({ email: '' });
        
        // Reset form after showing success
        setTimeout(() => {
          setIsSubmitted(false);
        }, 3000);
      } else {
        // Handle error response
        console.error('Form submission error:', data.error);
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Network error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
    <section className={styles.formSection}>
      <div className={styles.formContainer}>
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>Stay in the Loop</h2>
          <p className={styles.formSubtitle}>Keep updated on new dance projects and updates!</p>
        </div>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onFocus={() => handleFocus('email')}
                onBlur={handleBlur}
                className={`${styles.input} ${focusedField === 'email' ? styles.focused : ''}`}
                placeholder=" "
                required
              />
              <label className={`${styles.label} ${formData.email || focusedField === 'email' ? styles.active : ''}`}>
                Email Address
              </label>
              <div className={styles.inputLine}></div>
            </div>
          </div>

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
        </form>

        {error && (
          <div className={styles.errorMessage}>
            <div className={styles.errorIcon}>⚠</div>
            <p>{error}</p>
          </div>
        )}

        {isSubmitted && (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✓</div>
            <p>Successfully subscribed! We&apos;ll keep you updated on new projects.</p>
          </div>
        )}
      </div>
    </section>
  );
} 