import Image from 'next/image';
import styles from './ProjectSlide.module.css';

export default function ProjectSlide({ project }) {
  const handleButtonClick = () => {
    if (project.comingSoon) {
      // For coming soon projects, you could show a modal or notification
      alert(`${project.title} is coming soon!`);
    } else if (project.url) {
      // For live projects, navigate to the URL
      window.open(project.url, '_blank');
    }
  };

  // Extract colors from the gradient for the overlay
  const getOverlayGradient = (gradient) => {
    // Extract the first color from the gradient
    const colorMatch = gradient.match(/#[a-fA-F0-9]{6}/);
    const primaryColor = colorMatch ? colorMatch[0] : '#667eea';
    
    // Create a semi-transparent overlay using the project's primary color
    return `linear-gradient(
      135deg,
      ${primaryColor}80 0%,
      ${primaryColor}40 50%,
      rgba(0, 0, 0, 0.6) 100%
    )`;
  };

  // Extract colors from the gradient for the description background
  const getDescriptionBackground = (gradient) => {
    // Extract the first color from the gradient
    const colorMatch = gradient.match(/#[a-fA-F0-9]{6}/);
    const primaryColor = colorMatch ? colorMatch[0] : '#667eea';
    
    // Create a subtle background using the project's primary color
    return {
      background: `linear-gradient(135deg, ${primaryColor}20 0%, ${primaryColor}10 100%)`,
      border: `1px solid ${primaryColor}30`
    };
  };

  const buttonStyle = {
    background: project.gradient,
    color: '#fff',
    border: 'none',
    padding: '1rem 3rem',
    borderRadius: '50px',
    fontSize: '1.25rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    boxShadow: project.comingSoon 
      ? '0 10px 30px rgba(0, 0, 0, 0.2)' 
      : '0 10px 30px rgba(0, 255, 136, 0.3)',
    opacity: project.comingSoon ? 0.8 : 1
  };

  const categoryStyle = {
    background: project.gradient,
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: '600',
    display: 'inline-block',
    marginBottom: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
  };

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
        <div 
          className={styles.overlay} 
          style={{
            background: getOverlayGradient(project.gradient)
          }}
        />
      </div>
      
      {/* Content */}
      <div className={styles.content}>
        <div className={styles.header}>
          <div style={categoryStyle}>{project.category}</div>
          <div className={styles.title}>{project.title}</div>
        </div>
        
        <div 
          className={styles.description}
          style={{
            ...getDescriptionBackground(project.gradient),
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)'
          }}
        >
          {project.description}
        </div>
        
        <div className={styles.actions}>
          <div className={styles.iconContainer}>
            <span className={styles.icon}>{project.icon}</span>
          </div>
          <button 
            style={buttonStyle}
            onClick={handleButtonClick}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.opacity = '1';
              e.target.style.boxShadow = project.comingSoon 
                ? '0 15px 40px rgba(0, 0, 0, 0.3)' 
                : '0 15px 40px rgba(0, 255, 136, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.opacity = project.comingSoon ? '0.8' : '1';
              e.target.style.boxShadow = project.comingSoon 
                ? '0 10px 30px rgba(0, 0, 0, 0.2)' 
                : '0 10px 30px rgba(0, 255, 136, 0.3)';
            }}
          >
            {project.comingSoon ? 'COMING SOON' : 'GO'}
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