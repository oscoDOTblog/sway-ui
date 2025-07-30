'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
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
    setError('');
    
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
        setFormData({ name: '', email: '', message: '' });
        
        // Reset form after showing success
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } else {
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
    <div className={styles.container}>
      {/* Netflix-style Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <Link href="/" className={styles.logoText}>SWAY</Link>
          </div>
          <nav className={styles.nav}>
            <Link href="/" className={styles.navLink}>Home</Link>
            <Link href="/" className={styles.navLink}>Projects</Link>
            <Link href="/" className={styles.navLink}>About</Link>
            <Link href="/contact" className={`${styles.navLink} ${styles.active}`}>Contact</Link>
          </nav>
        </div>
      </header>

      {/* Contact Form Section */}
      <section className={styles.contactSection}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h1 className={styles.formTitle}>Get in Touch</h1>
            <p className={styles.formSubtitle}>Have a question or want to collaborate? Drop us a message!</p>
          </div>
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('name')}
                  onBlur={handleBlur}
                  className={`${styles.input} ${focusedField === 'name' ? styles.focused : ''}`}
                  placeholder=" "
                  required
                />
                <label className={`${styles.label} ${formData.name || focusedField === 'name' ? styles.active : ''}`}>
                  Your Name
                </label>
                <div className={styles.inputLine}></div>
              </div>
            </div>

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

            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('message')}
                  onBlur={handleBlur}
                  className={`${styles.textarea} ${focusedField === 'message' ? styles.focused : ''}`}
                  placeholder=" "
                  required
                />
                <label className={`${styles.label} ${formData.message || focusedField === 'message' ? styles.active : ''}`}>
                  Your Message
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
                'Send Message'
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
              <p>Message sent successfully! We&apos;ll get back to you soon.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 