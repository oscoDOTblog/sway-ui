import Image from 'next/image';
import styles from './ProjectSlide.module.css';

export default function ProjectSlide({ project }) {
  return (
    <div className={styles.slideContainer}>
      {/* Background Image */}
      <div className={styles.backgroundImage}>
        <Image
          src={project.backgroundImage}
          alt={project.title}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className={styles.overlay} />
      </div>
      
      {/* Content */}
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.category}>{project.category}</div>
          <div className={styles.title}>{project.title}</div>
        </div>
        
        <div className={styles.description}>
          {project.description}
        </div>
        
        <div className={styles.actions}>
          <div className={styles.iconContainer}>
            <span className={styles.icon}>{project.icon}</span>
          </div>
          <button className={styles.goButton}>
            GO
          </button>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className={styles.decorativeElements}>
        <div className={styles.geometricShape}></div>
        <div className={styles.geometricShape2}></div>
      </div>
    </div>
  );
} 