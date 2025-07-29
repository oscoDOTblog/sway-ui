import styles from './Footer.module.css';

export default function Footer() {
  const socialLinks = [
    {
      name: 'GitHub',
      icon: '🐙',
      url: 'https://github.com'
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      url: 'https://linkedin.com'
    },
    {
      name: 'Twitter',
      icon: '🐦',
      url: 'https://twitter.com'
    },
    {
      name: 'Instagram',
      icon: '📸',
      url: 'https://instagram.com'
    },
    {
      name: 'YouTube',
      icon: '📺',
      url: 'https://youtube.com'
    }
  ];

  const handleSocialClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.socialLinks}>
        {socialLinks.map((social) => (
          <button
            key={social.name}
            className={styles.socialButton}
            onClick={() => handleSocialClick(social.url)}
            title={social.name}
          >
            <span className={styles.socialIcon}>{social.icon}</span>
          </button>
        ))}
      </div>
      <div className={styles.copyright}>
        © 2024 Sway Portfolio. All rights reserved.
      </div>
    </footer>
  );
} 