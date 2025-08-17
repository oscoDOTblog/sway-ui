import Link from 'next/link';
import { format } from 'date-fns';
import styles from './RelatedPosts.module.css';

export default function RelatedPosts({ posts, currentSlug }) {
  if (!posts || posts.length === 0) {
    return null;
  }

  // Filter out the current post and limit to 3 posts
  const relatedPosts = posts
    .filter(post => post.slug !== currentSlug)
    .slice(0, 3);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className={styles.relatedSection}>
      <div className={styles.relatedContainer}>
        <h2 className={styles.relatedTitle}>Related Posts</h2>
        <div className={styles.relatedGrid}>
          {relatedPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.relatedCard}>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{post.title}</h3>
                {post.excerpt && (
                  <p className={styles.cardExcerpt}>{post.excerpt}</p>
                )}
                <div className={styles.cardMeta}>
                  <span className={styles.cardCategory}>{post.category}</span>
                  <span className={styles.cardDate}>
                    {format(new Date(post.publishedAt), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
