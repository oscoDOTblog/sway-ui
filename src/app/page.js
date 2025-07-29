'use client';

import { useState } from 'react';
import ProjectSlide from './components/ProjectSlide';
import Sidebar from './components/Sidebar';
import { projects } from './data/projects';
import styles from './page.module.css';

export default function Home() {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);

  const handleProjectChange = (index) => {
    setCurrentProjectIndex(index);
  };

  return (
    <div className={styles.container}>
      <Sidebar 
        projects={projects}
        currentIndex={currentProjectIndex}
        onProjectChange={handleProjectChange}
      />
      <main className={styles.main}>
        <ProjectSlide project={projects[currentProjectIndex]} />
      </main>
    </div>
  );
} 