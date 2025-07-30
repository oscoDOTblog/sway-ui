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
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [showSwipeIndicator, setShowSwipeIndicator] = useState(false);
  const [swipeFeedback, setSwipeFeedback] = useState(0);
  const [showHapticFeedback, setShowHapticFeedback] = useState(false);
  const mainRef = useRef(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const handleProjectChange = (index) => {
    setCurrentProjectIndex(index);
  };

  const showHapticFeedbackIndicator = () => {
    setShowHapticFeedback(true);
    setTimeout(() => setShowHapticFeedback(false), 600);
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
    setSwipeFeedback(0);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
    
    // Add visual feedback during swipe
    if (touchStart) {
      const distance = touchStart - e.targetTouches[0].clientY;
      const feedback = Math.max(-20, Math.min(20, distance * 0.1));
      setSwipeFeedback(feedback);
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setSwipeFeedback(0);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > minSwipeDistance;
    const isDownSwipe = distance < -minSwipeDistance;

    if (isUpSwipe) {
      // Swipe up - go to next project
      setCurrentProjectIndex((prevIndex) => 
        prevIndex === projects.length - 1 ? 0 : prevIndex + 1
      );
      showHapticFeedbackIndicator();
    } else if (isDownSwipe) {
      // Swipe down - go to previous project
      setCurrentProjectIndex((prevIndex) => 
        prevIndex === 0 ? projects.length - 1 : prevIndex - 1
      );
      showHapticFeedbackIndicator();
    }
    
    setSwipeFeedback(0);
  };

  // Show swipe indicator on mobile after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.innerWidth <= 768) {
        setShowSwipeIndicator(true);
        setTimeout(() => setShowSwipeIndicator(false), 3000);
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
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{
            transform: `translateY(${swipeFeedback}px)`,
            transition: swipeFeedback === 0 ? 'transform 0.3s ease' : 'none'
          }}
        >
          {isNewsProject ? (
            <NewsletterSignup project={currentProject} />
          ) : (
            <ProjectSlide project={currentProject} />
          )}
          
          {/* Swipe Indicator */}
          {showSwipeIndicator && (
            <div className={styles.swipeIndicator}>
              <div className={styles.swipeArrow}>↑</div>
              <div className={styles.swipeText}>Swipe to change project</div>
              <div className={styles.swipeArrow}>↓</div>
            </div>
          )}
          
          {/* Haptic Feedback */}
          {showHapticFeedback && (
            <div className={styles.hapticFeedback}>
              ✓
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
} 