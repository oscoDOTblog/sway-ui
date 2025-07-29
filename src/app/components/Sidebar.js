import styles from './Sidebar.module.css';

export default function Sidebar({ projects, currentIndex, onProjectChange }) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.title}>swayDOTquest</h2>
        <div className={styles.subtitle}>What We're Cooking</div>
      </div>
      
      <div className={styles.projectList}>
        {projects.map((project, index) => (
          <div
            key={project.id}
            className={`${styles.projectItem} ${index === currentIndex ? styles.active : ''}`}
            onClick={() => onProjectChange(index)}
          >
            <div className={styles.projectIcon}>
              <span className={styles.icon}>{project.icon}</span>
            </div>
            <div className={styles.projectInfo}>
              <div className={styles.projectTitle}>{project.title}</div>
              <div className={styles.projectCategory}>{project.category}</div>
            </div>
            {index === currentIndex && (
              <div className={styles.activeIndicator}>
                <div className={styles.activeDot}></div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className={styles.footer}>
        <div className={styles.counter}>
          {currentIndex + 1} / {projects.length}
        </div>
      </div>
    </div>
  );
} 