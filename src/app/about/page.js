import PersonaMenu from '../components/PersonaMenu';
import styles from './page.module.css';

export default function AboutPage() {
  return (
    <div className={styles.aboutContainer}>
      <div className={styles.aboutContent}>
        <PersonaMenu />
      </div>
    </div>
  );
} 