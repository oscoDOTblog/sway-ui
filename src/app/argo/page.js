'use client';

import { useState, useEffect } from 'react';
import BlogGenerator from '@/components/admin/BlogGenerator';
import BlogManager from '@/components/admin/BlogManager';
import LoginModal from '@/components/admin/LoginModal';
import { sessionUtils } from '@/config/adminConfig';
import styles from './page.module.css';

export default function ArgoPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openModules, setOpenModules] = useState({
    blogGenerator: false, // Start with blog generator closed
    blogManager: false, // Start with blog manager closed
    // Future modules will be added here
  });

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const isValid = sessionUtils.isSessionValid();
      setIsAuthenticated(isValid);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionUtils.clearSession();
    setIsAuthenticated(false);
  };

  const toggleModule = (moduleName) => {
    setOpenModules(prev => ({
      ...prev,
      [moduleName]: !prev[moduleName]
    }));
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Show login modal if not authenticated
  if (!isAuthenticated) {
    return <LoginModal onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.title}>Argo Admin Panel</h1>
            <p className={styles.subtitle}>Configuration and management tools for Sway Quest</p>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.main}>
        {/* Blog Generator Module */}
        <div className={styles.module}>
          <button 
            className={`${styles.moduleHeader} ${openModules.blogGenerator ? styles.open : ''}`}
            onClick={() => toggleModule('blogGenerator')}
          >
            <div className={styles.moduleTitle}>
              <span className={styles.moduleIcon}>📝</span>
              <h2>Blog Generator</h2>
            </div>
            <span className={styles.moduleToggle}>
              {openModules.blogGenerator ? '−' : '+'}
            </span>
          </button>
          
          {openModules.blogGenerator && (
            <div className={styles.moduleContent}>
              <BlogGenerator />
            </div>
          )}
        </div>

        {/* Blog Manager Module */}
        <div className={styles.module}>
          <button 
            className={`${styles.moduleHeader} ${openModules.blogManager ? styles.open : ''}`}
            onClick={() => toggleModule('blogManager')}
          >
            <div className={styles.moduleTitle}>
              <span className={styles.moduleIcon}>📊</span>
              <h2>Blog Manager</h2>
            </div>
            <span className={styles.moduleToggle}>
              {openModules.blogManager ? '−' : '+'}
            </span>
          </button>
          
          {openModules.blogManager && (
            <div className={styles.moduleContent}>
              <BlogManager />
            </div>
          )}
        </div>

        {/* Future Modules Placeholder */}
        <div className={styles.module}>
          <button 
            className={`${styles.moduleHeader} ${openModules.userManagement ? styles.open : ''}`}
            onClick={() => toggleModule('userManagement')}
          >
            <div className={styles.moduleTitle}>
              <span className={styles.moduleIcon}>👥</span>
              <h2>User Management</h2>
            </div>
            <span className={styles.moduleToggle}>
              {openModules.userManagement ? '−' : '+'}
            </span>
          </button>
          
          {openModules.userManagement && (
            <div className={styles.moduleContent}>
              <div className={styles.comingSoon}>
                <p>🚧 User Management module coming soon...</p>
                <p>Manage users, permissions, and access controls</p>
              </div>
            </div>
          )}
        </div>

        <div className={styles.module}>
          <button 
            className={`${styles.moduleHeader} ${openModules.analytics ? styles.open : ''}`}
            onClick={() => toggleModule('analytics')}
          >
            <div className={styles.moduleTitle}>
              <span className={styles.moduleIcon}>📊</span>
              <h2>Analytics & Insights</h2>
            </div>
            <span className={styles.moduleToggle}>
              {openModules.analytics ? '−' : '+'}
            </span>
          </button>
          
          {openModules.analytics && (
            <div className={styles.moduleContent}>
              <div className={styles.comingSoon}>
                <p>🚧 Analytics module coming soon...</p>
                <p>View site statistics, user engagement, and performance metrics</p>
              </div>
            </div>
          )}
        </div>

        <div className={styles.module}>
          <button 
            className={`${styles.moduleHeader} ${openModules.settings ? styles.open : ''}`}
            onClick={() => toggleModule('settings')}
          >
            <div className={styles.moduleTitle}>
              <span className={styles.moduleIcon}>⚙️</span>
              <h2>Site Settings</h2>
            </div>
            <span className={styles.moduleToggle}>
              {openModules.settings ? '−' : '+'}
            </span>
          </button>
          
          {openModules.settings && (
            <div className={styles.moduleContent}>
              <div className={styles.comingSoon}>
                <p>🚧 Settings module coming soon...</p>
                <p>Configure site preferences, themes, and global settings</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
