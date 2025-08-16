'use client';

import { useState } from 'react';
import { sessionUtils } from '@/config/adminConfig';
import styles from './LoginModal.module.css';

export default function LoginModal({ onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Server-side password validation
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        // Store session
        sessionUtils.storeSession(password);
        
        // Call success callback
        onLoginSuccess();
      } else {
        setError(data.error || 'Invalid password. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Admin Access Required</h2>
          <p className={styles.subtitle}>
            Enter the admin password to access the Sway Quest admin panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Admin Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter admin password..."
              className={styles.input}
              disabled={isLoading}
              autoFocus
            />
          </div>

          {error && (
            <div className={styles.error}>
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password.trim()}
            className={styles.submitButton}
          >
            {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.note}>
            This session will remain active for 24 hours
          </p>
        </div>
      </div>
    </div>
  );
}
