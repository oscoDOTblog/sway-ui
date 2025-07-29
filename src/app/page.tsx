import GachaBanner from './components/GachaBanner';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <GachaBanner />
    </div>
  );
}
