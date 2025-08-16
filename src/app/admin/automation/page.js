'use client';

import { useState, useEffect } from 'react';
import { blogService } from '../../../lib/blogService';
import { getTopicByCategoryRotation, getCharacterByDate, blogConfig } from '../../../config/blogConfig';
import styles from './page.module.css';

export default function AutomationDashboard() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPosts: 0,
    thisWeek: 0,
    thisMonth: 0
  });
  const [rotationInfo, setRotationInfo] = useState({
    todayCategory: '',
    todayCharacter: '',
    tomorrowCategory: '',
    tomorrowCharacter: ''
  });

  useEffect(() => {
    loadRecentPosts();
    loadRotationInfo();
  }, []);

  const loadRecentPosts = async () => {
    try {
      setLoading(true);
      const posts = await blogService.getAllPosts();
      
      // Sort by creation date (newest first)
      const sortedPosts = posts.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setRecentPosts(sortedPosts.slice(0, 10)); // Show last 10 posts
      
      // Calculate stats
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const thisWeek = posts.filter(post => 
        new Date(post.createdAt) >= weekAgo
      ).length;
      
      const thisMonth = posts.filter(post => 
        new Date(post.createdAt) >= monthAgo
      ).length;
      
      setStats({
        totalPosts: posts.length,
        thisWeek,
        thisMonth
      });
      
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRotationInfo = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const todayCategory = getTopicByCategoryRotation(today);
    const todayCharacter = getCharacterByDate(today);
    const tomorrowCategory = getTopicByCategoryRotation(tomorrow);
    const tomorrowCharacter = getCharacterByDate(tomorrow);
    
    setRotationInfo({
      todayCategory,
      todayCharacter,
      tomorrowCategory,
      tomorrowCharacter
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCharacterEmoji = (character) => {
    const emojis = {
      luna: '✨',
      marcus: '😎',
      alex: '💪',
      zara: '🔥',
      kai: '🌙',
      jordan: '🏃',
      rio: '🎵'
    };
    return emojis[character] || '👤';
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading automation dashboard...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🤖 Blog Automation Dashboard</h1>
      
      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Posts</h3>
          <p className={styles.statNumber}>{stats.totalPosts}</p>
        </div>
        <div className={styles.statCard}>
          <h3>This Week</h3>
          <p className={styles.statNumber}>{stats.thisWeek}</p>
        </div>
        <div className={styles.statCard}>
          <h3>This Month</h3>
          <p className={styles.statNumber}>{stats.thisMonth}</p>
        </div>
      </div>

      {/* Automation Status */}
      <div className={styles.statusSection}>
        <h2>🕐 Automation Status</h2>
        <div className={styles.statusCard}>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>Cron Job:</span>
            <span className={styles.statusValue}>✅ Active (Daily at 9:00 AM)</span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>Next Run:</span>
            <span className={styles.statusValue}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} at 9:00 AM
            </span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>Today's Category:</span>
            <span className={styles.statusValue}>{rotationInfo.todayCategory}</span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>Today's Character:</span>
            <span className={styles.statusValue}>{blogConfig.characters[rotationInfo.todayCharacter]?.name || rotationInfo.todayCharacter}</span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>Tomorrow's Category:</span>
            <span className={styles.statusValue}>{rotationInfo.tomorrowCategory}</span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>Tomorrow's Character:</span>
            <span className={styles.statusValue}>{blogConfig.characters[rotationInfo.tomorrowCharacter]?.name || rotationInfo.tomorrowCharacter}</span>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className={styles.recentSection}>
        <h2>📝 Recent Posts</h2>
        <div className={styles.postsGrid}>
          {recentPosts.map((post) => (
            <div key={post.id} className={styles.postCard}>
              <div className={styles.postHeader}>
                <span className={styles.characterEmoji}>
                  {getCharacterEmoji(post.character)}
                </span>
                <span className={styles.postDate}>
                  {formatDate(post.createdAt)}
                </span>
              </div>
              <h3 className={styles.postTitle}>{post.title}</h3>
              <p className={styles.postExcerpt}>{post.excerpt}</p>
              <div className={styles.postMeta}>
                <span className={styles.postCategory}>{post.category}</span>
                <span className={styles.postReadTime}>{post.readTime} min read</span>
              </div>
              <a 
                href={`/blog/${post.slug}`} 
                className={styles.postLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Post →
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Generation */}
      <div className={styles.manualSection}>
        <h2>🎯 Manual Generation</h2>
        <p className={styles.manualNote}>
          You can still manually generate posts through the admin panel. 
          Automated generation runs daily at 9:00 AM and uses intelligent 
          topic and character rotation.
        </p>
      </div>
    </div>
  );
}
