'use client';

import { useState } from 'react';
import { projects } from './data/projects';
import AnimatedForm from './components/AnimatedForm';
import SimpleNewsletterSignup from './components/SimpleNewsletterSignup';
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

  // Touch feedback handlers for mobile
  const handleTouchStart = (e) => {
    e.currentTarget.style.transform = 'scale(0.98)';
    e.currentTarget.style.transition = 'transform 0.1s ease';
  };

  const handleTouchEnd = (e) => {
    e.currentTarget.style.transform = '';
    e.currentTarget.style.transition = '';
  };

  // Touch feedback for GO button
  const handleGoButtonTouchStart = (e) => {
    e.currentTarget.style.transform = 'scale(0.95)';
    e.currentTarget.style.transition = 'transform 0.1s ease';
  };

  const handleGoButtonTouchEnd = (e) => {
    e.currentTarget.style.transform = '';
    e.currentTarget.style.transition = '';
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
          <p className={styles.heroSubtitle}>Your journey to becoming a better dancer starts here</p>
          <div className={styles.heroButtons}>
            <a href="https://f4.sway.quest" target="_blank" rel="noopener noreferrer" className={styles.ctaButton}>
              Try F4 App
            </a>
            <a href="#features" className={styles.secondaryButton}>
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className={styles.missionSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.missionCard}>
            <h2 className={styles.sectionTitle}>Our Mission</h2>
            <p className={styles.missionText}>
              Sway is dedicated to making dance education accessible to everyone. Whether you're a complete beginner 
              or an experienced dancer looking to expand your repertoire, our platform provides step-by-step guidance 
              for learning iconic dance moves.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.featuresSection}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>Not Your Average Online Tutorial</h2>
          <p className={styles.sectionSubtitle}>
            Sway's tools make your online learning experience just like a class at a physical studio – but better.
          </p>
          
          <div className={styles.featuresList}>
            {/* AI Coach Feature */}
            <div className={styles.featureHeroCard}>
              <div className={styles.featureContent}>
                <div className={styles.featureInfo}>
                  <div className={styles.featureIcon}>🤖</div>
                  <h3 className={styles.featureTitle}>AI Dance Coach</h3>
                  <p className={styles.featureDescription}>
                    Get personalized feedback on your dance moves with our advanced AI coach. 
                    Practice with confidence knowing you're getting real-time guidance.
                  </p>
                </div>
                <div className={styles.videoPlaceholder}>
                  <div className={styles.placeholderContent}>
                    <span className={styles.placeholderIcon}>🎥</span>
                    <p>AI Coach Demo Video</p>
                    <span className={styles.comingSoon}>Coming Soon</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Player Feature */}
            <div className={styles.featureHeroCard}>
              <div className={styles.featureContent}>
                <div className={styles.featureInfo}>
                  <div className={styles.featureIcon}>🎬</div>
                  <h3 className={styles.featureTitle}>Advanced Video Player</h3>
                  <p className={styles.featureDescription}>
                    Switch between front and back views, loop moves, mirror videos, control speed, 
                    and use camera mode for real-time self-correction.
                  </p>
                </div>
                <div className={styles.videoPlaceholder}>
                  <div className={styles.placeholderContent}>
                    <span className={styles.placeholderIcon}>🎥</span>
                    <p>Video Player Demo</p>
                    <span className={styles.comingSoon}>Coming Soon</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Library Feature */}
            <div className={styles.featureHeroCard}>
              <div className={styles.featureContent}>
                <div className={styles.featureInfo}>
                  <div className={styles.featureIcon}>📚</div>
                  <h3 className={styles.featureTitle}>Comprehensive Library</h3>
                  <p className={styles.featureDescription}>
                    Access a growing collection of dance moves from various styles and difficulty levels. 
                    From Hip Hop to Breaking, find your next challenge.
                  </p>
                </div>
                <div className={styles.libraryPreview}>
                  <div className={styles.styleTags}>
                    <span className={styles.styleTag}>Hip Hop</span>
                    <span className={styles.styleTag}>Breaking</span>
                    <span className={styles.styleTag}>Contemporary</span>
                    <span className={styles.styleTag}>Popping</span>
                    <span className={styles.styleTag}>House</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorksSection}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>1</div>
              <h3 className={styles.stepTitle}>Browse Moves</h3>
              <p className={styles.stepDescription}>
                Explore our library of dance moves, filtered by difficulty and style
              </p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>2</div>
              <h3 className={styles.stepTitle}>Learn Step-by-Step</h3>
              <p className={styles.stepDescription}>
                Follow detailed instructions and watch video demonstrations
              </p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>3</div>
              <h3 className={styles.stepTitle}>Practice & Improve</h3>
              <p className={styles.stepDescription}>
                Practice at your own pace and track your progress
              </p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>4</div>
              <h3 className={styles.stepTitle}>Celebrate Success</h3>
              <p className={styles.stepDescription}>
                Earn achievements and celebrate your dance journey
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Current App Section */}
      <section className={styles.currentAppSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.appContent}>
            <div className={styles.appInfo}>
              <h2 className={styles.appTitle}>Try Our Current App</h2>
              <p className={styles.appDescription}>
                Experience the future of dance learning with F4 - our interactive dance platform 
                featuring AI feedback, comprehensive move library, and progress tracking.
              </p>
              <div className={styles.appFeatures}>
                <div className={styles.appFeature}>
                  <span className={styles.checkmark}>✓</span>
                  AI-powered dance feedback
                </div>
                <div className={styles.appFeature}>
                  <span className={styles.checkmark}>✓</span>
                  Step-by-step move breakdowns
                </div>
                <div className={styles.appFeature}>
                  <span className={styles.checkmark}>✓</span>
                  Progress tracking & achievements
                </div>
                <div className={styles.appFeature}>
                  <span className={styles.checkmark}>✓</span>
                  Mobile-responsive design
                </div>
              </div>
              <a href="https://f4.sway.quest" target="_blank" rel="noopener noreferrer" className={styles.appButton}>
                Launch F4 App
              </a>
            </div>
            <div className={styles.appVisual}>
              <div className={styles.appMockup}>
                <div className={styles.mockupContent}>
                  <span className={styles.mockupIcon}>📱</span>
                  <p>F4.sway.quest</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className={styles.newsletterSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.newsletterContent}>
            <h2 className={styles.newsletterTitle}>Stay in the Loop</h2>
            <p className={styles.newsletterDescription}>
              Get the latest dance content, updates, and exclusive access to new features. 
              Sign up for our newsletter and receive a special promo code for early access!
            </p>
            <SimpleNewsletterSignup />
          </div>
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
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
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
                      <span 
                        className={styles.projectCategory}
                        style={{ background: project.gradient }}
                      >
                        {project.category}
                      </span>
                      {project.comingSoon && (
                        <span className={styles.comingSoon}>Coming Soon</span>
                      )}
                      {!project.comingSoon && project.url && (
                        <a 
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.goButton}
                          onClick={(e) => e.stopPropagation()}
                          onTouchStart={handleGoButtonTouchStart}
                          onTouchEnd={handleGoButtonTouchEnd}
                        >
                          GO
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

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