'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { projects } from '../data/projects';
import styles from './Header.module.css';

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logo}>
          <Link href="/" className={styles.logoLink}>
            <span className={styles.logoText}>swayDOTquest</span>
          </Link>
        </div>
        <nav className={styles.nav}>
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
          <Link href="/about" className={styles.navLink}>About</Link>
          <Link href="/contact" className={styles.navLink}>Contact</Link>
        </nav>
      </div>
    </header>
  );
} 