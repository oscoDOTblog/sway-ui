'use client';

import { useState, useEffect, useRef } from 'react';
import ProjectSlide from './components/ProjectSlide';
import NewsletterSignup from './components/NewsletterSignup';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import { projects } from './data/projects';
import styles from './page.module.css';

export default function Home() {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [showSidebarIndicator, setShowSidebarIndicator] = useState(false);
  const mainRef = useRef(null);

  const handleProjectChange = (index) => {
    setCurrentProjectIndex(index);
  };

  // Show sidebar indicator on mobile after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.innerWidth <= 768) {
        setShowSidebarIndicator(true);
        setTimeout(() => setShowSidebarIndicator(false), 4000);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const currentProject = projects[currentProjectIndex];
  
  // Check if the current project is the News project (id: 4)
  const isNewsProject = currentProject.id === 4;

  return (
    <div className={styles.container}>
      <Sidebar 
        projects={projects}
        currentIndex={currentProjectIndex}
        onProjectChange={handleProjectChange}
      />
      <div className={styles.contentArea}>
        <main 
          ref={mainRef}
          className={styles.main}
        >
          {isNewsProject ? (
            <NewsletterSignup project={currentProject} />
          ) : (
            <ProjectSlide project={currentProject} />
          )}
          
          {/* Sidebar Scroll Indicator */}
          {showSidebarIndicator && (
            <div className={styles.sidebarIndicator}>
              <div className={styles.indicatorArrow}>↑</div>
              <div className={styles.indicatorText}>Click and scroll to explore projects</div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
} 