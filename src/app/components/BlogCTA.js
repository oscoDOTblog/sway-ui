'use client';

import Link from 'next/link';
import styles from './BlogCTA.module.css';

export default function BlogCTA() {
  return (
    <div className={styles.ctaContainer}>
      <div className={styles.ctaContent}>
        <div className={styles.ctaIcon}>🕺</div>
        <h3 className={styles.ctaTitle}>Want to level up your dance?</h3>
        <p className={styles.ctaDescription}>
          Master dance moves with real-time feedback, advanced video controls, and a comprehensive library. 
          Join our worldwide community and track your progress as you become a better dancer.
        </p>
        <div className={styles.ctaFeatures}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>⚡</span>
            <span>Real-time Feedback</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🎬</span>
            <span>Advanced Video Player</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>📚</span>
            <span>Comprehensive Library</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>📊</span>
            <span>Track Progress</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🌍</span>
            <span>Worldwide Community</span>
          </div>
        </div>
        
        <div className={styles.ctaStats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>100+</span>
            <span className={styles.statLabel}>Dance Moves</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>1000+</span>
            <span className={styles.statLabel}>Dancers</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>24/7</span>
            <span className={styles.statLabel}>Feedback</span>
          </div>
        </div>
        
        <Link href="https://app.sway.quest/" className={styles.ctaButton}>
          Try Sway App →
        </Link>
      </div>
    </div>
  );
}

