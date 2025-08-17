import Link from 'next/link';
import { format } from 'date-fns';
import styles from './BlogNavigation.module.css';

export default function BlogNavigation({ prev, next }) {
  if (!prev && !next) {
    return null;
  }

  return (
    <nav className={styles.navigation}>
      <div className={styles.navContainer}>
        {/* Previous Post */}
        {prev && (
          <Link href={`/blog/${prev.slug}`} className={styles.navLink}>
            <div className={styles.navCard}>
              <div className={styles.navArrow}>←</div>
              <div className={styles.navContent}>
                <span className={styles.navLabel}>Previous Post</span>
                <h3 className={styles.navTitle}>{prev.title}</h3>
                {prev.excerpt && (
                  <p className={styles.navExcerpt}>{prev.excerpt}</p>
                )}
                <div className={styles.navMeta}>
                  <span className={styles.navCategory}>{prev.category}</span>
                  <span className={styles.navDate}>
                    {format(new Date(prev.publishedAt), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Next Post */}
        {next && (
          <Link href={`/blog/${next.slug}`} className={styles.navLink}>
            <div className={styles.navCard}>
              <div className={styles.navContent}>
                <span className={styles.navLabel}>Next Post</span>
                <h3 className={styles.navTitle}>{next.title}</h3>
                {next.excerpt && (
                  <p className={styles.navExcerpt}>{next.excerpt}</p>
                )}
                <div className={styles.navMeta}>
                  <span className={styles.navCategory}>{next.category}</span>
                  <span className={styles.navDate}>
                    {format(new Date(next.publishedAt), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
              <div className={styles.navArrow}>→</div>
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
}
