'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

import styles from './Header.module.css';

export default function Header() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  const menuRef = useRef(null);
  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const navRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Dynamic header resizing and mobile detection
  useEffect(() => {
    const adjustHeaderSize = () => {
      if (!headerRef.current || !logoRef.current || !navRef.current) return;

      const headerWidth = headerRef.current.offsetWidth;
      const logoWidth = logoRef.current.offsetWidth;
      const navWidth = navRef.current.offsetWidth;
      const padding = 32; // Account for padding and gaps
      
      const availableSpace = headerWidth - navWidth - padding;
      const shouldBeCompact = availableSpace < logoWidth + 50; // 50px buffer
      const isMobileView = headerWidth < 768;

      // Set compact mode for very small screens
      setIsCompact(shouldBeCompact);
      setIsMobile(isMobileView);
    };

    // Initial check
    adjustHeaderSize();

    // Add resize listener
    window.addEventListener('resize', adjustHeaderSize);
    
    // Also check when the component mounts (for SSR)
    const timeout = setTimeout(adjustHeaderSize, 100);

    return () => {
      window.removeEventListener('resize', adjustHeaderSize);
      clearTimeout(timeout);
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className={styles.header} ref={headerRef}>
      <div className={`${styles.headerContent} ${isCompact ? styles.compact : ''}`}>
        <div className={styles.logo} ref={logoRef}>
          <Link href="/" className={styles.logoLink}>
            <span className={styles.logoText}>
              swayDOTquest
            </span>
          </Link>
        </div>
        <nav className={`${styles.nav} ${isCompact ? styles.compactNav : ''}`} ref={navRef}>
          {/* Show navigation links only on desktop */}
          {!isMobile && (
            <>
              <Link href="/" className={styles.navLink}>Home</Link>
              {/* <a 
                href="https://app.sway.quest" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.navLink}
              >
                App
              </a> */}
              <Link href="/blog" className={styles.navLink}>Blog</Link>
              <Link href="/tunes" className={styles.navLink}>Tunes</Link>
              <Link href="/contact" className={styles.navLink}>Contact</Link>
            </>
          )}
          
          {/* Show hamburger menu on mobile */}
          {isMobile && (
            <div className={styles.dropdownContainer} ref={menuRef}>
              <button 
                className={`${styles.navLink} ${styles.menuIcon}`}
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? '✕' : '☰'}
              </button>
              {isMenuOpen && (
                <div className={styles.dropdown}>
                  <Link href="/" className={styles.dropdownItem} onClick={closeMenu}>
                    <span className={styles.dropdownIcon}>🏠</span>
                    <div className={styles.dropdownContent}>
                      <span className={styles.dropdownTitle}>Home</span>
                    </div>
                  </Link>
                  {/* <a 
                    href="https://app.sway.quest" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.dropdownItem}
                    onClick={closeMenu}
                  >
                    <span className={styles.dropdownIcon}>📱</span>
                    <div className={styles.dropdownContent}>
                      <span className={styles.dropdownTitle}>App</span>
                    </div>
                  </a> */}
                  <Link href="/blog" className={styles.dropdownItem} onClick={closeMenu}>
                    <span className={styles.dropdownIcon}>📝</span>
                    <div className={styles.dropdownContent}>
                      <span className={styles.dropdownTitle}>Blog</span>
                    </div>
                  </Link>
                  <Link href="/tunes" className={styles.dropdownItem} onClick={closeMenu}>
                    <span className={styles.dropdownIcon}>🎵</span>
                    <div className={styles.dropdownContent}>
                      <span className={styles.dropdownTitle}>Tunes</span>
                    </div>
                  </Link>
                  <Link href="/contact" className={styles.dropdownItem} onClick={closeMenu}>
                    <span className={styles.dropdownIcon}>📧</span>
                    <div className={styles.dropdownContent}>
                      <span className={styles.dropdownTitle}>Contact</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
} 