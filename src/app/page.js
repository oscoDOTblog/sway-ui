'use client';

import { useState } from 'react';
import ProjectSlide from './components/ProjectSlide';
import NewsletterSignup from './components/NewsletterSignup';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import { projects } from './data/projects';
import styles from './page.module.css';

export default function Home() {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);

  const handleProjectChange = (index) => {
    setCurrentProjectIndex(index);
  };

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
        <main className={styles.main}>
          {isNewsProject ? (
            <NewsletterSignup project={currentProject} />
          ) : (
            <ProjectSlide project={currentProject} />
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
} 