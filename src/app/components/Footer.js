import { 
  FaInstagram, 
  FaTwitter, 
  FaYoutube,
  FaTiktok,
  FaDiscord
} from 'react-icons/fa';
import { 
  SiMastodon, 
  SiThreads,
  SiBluesky 
} from 'react-icons/si';
import { 
  SITE_DISCORD, 
  SOCIAL_INSTAGRAM, 
  SOCIAL_TWITTER, 
  SOCIAL_YOUTUBE,
  SOCIAL_BLUESKY,
  SOCIAL_MASTODON,
  SOCIAL_THREADS,
  SOCIAL_TIKTOK
} from '../config/config';
import styles from './Footer.module.css';

export default function Footer() {
  const socialLinks = [
    { url: SOCIAL_INSTAGRAM, icon: FaInstagram, label: 'Instagram' },
    { url: SOCIAL_TWITTER, icon: FaTwitter, label: 'Twitter' },
    { url: SOCIAL_YOUTUBE, icon: FaYoutube, label: 'YouTube' },
    { url: SOCIAL_TIKTOK, icon: FaTiktok, label: 'TikTok' },
    { url: SOCIAL_BLUESKY, icon: SiBluesky, label: 'Bluesky' },
    { url: SOCIAL_MASTODON, icon: SiMastodon, label: 'Mastodon' },
    { url: SOCIAL_THREADS, icon: SiThreads, label: 'Threads' },
    { url: SITE_DISCORD, icon: FaDiscord, label: 'Discord' }
  ];

  const handleSocialClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.socialLinks}>
        {socialLinks.map((social, index) => {
          const IconComponent = social.icon;
          return (
            <button
              key={index}
              className={styles.socialButton}
              onClick={() => handleSocialClick(social.url)}
              title={social.label}
              aria-label={social.label}
            >
              <IconComponent className={styles.socialIcon} />
            </button>
          );
        })}
      </div>
      <div className={styles.copyright}>
        © 2025 swayDOTquest. All rights reserved.
      </div>
    </footer>
  );
} 