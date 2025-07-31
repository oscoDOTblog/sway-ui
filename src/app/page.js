'use client';

import { useState } from 'react';
import { projects } from './data/projects';
import AnimatedForm from './components/AnimatedForm';
import Footer from './components/Footer';
import styles from './page.module.css';

export default function Home() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className={styles.container}>

      {/* Hero Section with Video Background */}
      <section className={styles.hero}>
        {/* Video Background */}
        <div className={styles.videoContainer}>
          <video
            className={styles.heroVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="/vids/nat-fly-girls-fixed.webm" type="video/webm" />
            {/* Fallback message if video fails */}
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Hero Content */}
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>swayDOTquest</h1>
          <p className={styles.heroSubtitle}>Your One-Stop Shop for Becoming a Better Dancer</p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className={styles.projectsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>The Lab</h2>
        </div>
        
        <div className={styles.projectsGrid}>
          {projects.map((project) => (
            <div 
              key={project.id} 
              className={styles.projectCard}
              onClick={() => handleProjectClick(project)}
            >
              <div className={styles.projectImage}>
                <img 
                  src={project.backgroundImage} 
                  alt={project.title}
                  className={styles.image}
                />
                <div className={styles.projectOverlay}>
                  <div className={styles.projectInfo}>
                    <h3 className={styles.projectTitle}>{project.title}</h3>
                    <p className={styles.projectDescription}>{project.description}</p>
                    <div className={styles.projectMeta}>
                      <span className={styles.projectCategory}>{project.category}</span>
                      {project.comingSoon && (
                        <span className={styles.comingSoon}>Coming Soon</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Animated Contact Form */}
      <AnimatedForm />

      {/* Footer */}
      <Footer />

      {/* Modal */}
      {isModalOpen && selectedProject && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>
              ×
            </button>
            <div className={styles.modalContent}>
              <div className={styles.modalImage}>
                <img 
                  src={selectedProject.backgroundImage} 
                  alt={selectedProject.title}
                  className={styles.modalImg}
                />
              </div>
              <div className={styles.modalInfo}>
                <h2 className={styles.modalTitle}>{selectedProject.title}</h2>
                <p className={styles.modalDescription}>{selectedProject.description}</p>
                <div className={styles.modalMeta}>
                  <span className={styles.modalCategory}>{selectedProject.category}</span>
                  <span className={styles.modalIcon}>{selectedProject.icon}</span>
                </div>
                {selectedProject.url && (
                  <a 
                    href={selectedProject.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.modalButton}
                  >
                    Visit Project
                  </a>
                )}
                {selectedProject.comingSoon && (
                  <span className={styles.modalComingSoon}>Coming Soon</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 