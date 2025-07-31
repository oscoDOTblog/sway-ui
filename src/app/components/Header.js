'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { projects } from '../data/projects';
import styles from './Header.module.css';

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [titleSize, setTitleSize] = useState('2rem');
  const [isCompact, setIsCompact] = useState(false);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const navRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Dynamic header resizing
  useEffect(() => {
    const adjustHeaderSize = () => {
      if (!headerRef.current || !logoRef.current || !navRef.current) return;

      const headerWidth = headerRef.current.offsetWidth;
      const logoWidth = logoRef.current.offsetWidth;
      const navWidth = navRef.current.offsetWidth;
      const padding = 32; // Account for padding and gaps
      
      const availableSpace = headerWidth - navWidth - padding;
      const shouldBeCompact = availableSpace < logoWidth + 50; // 50px buffer

      // Set compact mode for very small screens
      setIsCompact(shouldBeCompact);

      // Dynamic title sizing based on available space
      if (headerWidth < 320) {
        setTitleSize('0.8rem');
      } else if (headerWidth < 480) {
        setTitleSize('1rem');
      } else if (headerWidth < 768) {
        setTitleSize('1.4rem');
      } else if (shouldBeCompact) {
        setTitleSize('1.6rem');
      } else {
        setTitleSize('2rem');
      }
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isDropdownOpen || isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, isMenuOpen]);

  return (
    <header className={styles.header} ref={headerRef}>
      <div className={`${styles.headerContent} ${isCompact ? styles.compact : ''}`}>
        <div className={styles.logo} ref={logoRef}>
          <Link href="/" className={styles.logoLink}>
            <span 
              className={styles.logoText}
              style={{ fontSize: titleSize }}
            >
              swayDOTquest
            </span>
          </Link>
        </div>
        <nav className={`${styles.nav} ${isCompact ? styles.compactNav : ''}`} ref={navRef}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <div className={styles.dropdownContainer} ref={dropdownRef}>
            <button 
              className={styles.navLink}
              onClick={toggleDropdown}
            >
              Projects ▼
            </button>
            {isDropdownOpen && (
              <div className={styles.dropdown}>
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={project.url || '#'}
                    className={styles.dropdownItem}
                    onClick={closeDropdown}
                    target={project.url ? '_blank' : undefined}
                    rel={project.url ? 'noopener noreferrer' : undefined}
                  >
                    <span className={styles.dropdownIcon}>{project.icon}</span>
                    <div className={styles.dropdownContent}>
                      <span className={styles.dropdownTitle}>{project.title}</span>
                      <span className={styles.dropdownCategory}>{project.category}</span>
                      {project.comingSoon && (
                        <span className={styles.dropdownComingSoon}>Coming Soon</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          {!isCompact && <Link href="/about" className={styles.navLink}>About</Link>}
          {!isCompact && <Link href="/contact" className={styles.navLink}>Contact</Link>}
          {isCompact && (
            <div className={styles.dropdownContainer} ref={menuRef}>
              <button 
                className={`${styles.navLink} ${styles.menuIcon}`}
                onClick={toggleMenu}
              >
                ⋯
              </button>
              {isMenuOpen && (
                <div className={styles.dropdown}>
                  <Link href="/about" className={styles.dropdownItem} onClick={closeMenu}>
                    <span className={styles.dropdownIcon}>📋</span>
                    <div className={styles.dropdownContent}>
                      <span className={styles.dropdownTitle}>About</span>
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