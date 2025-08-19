import { blogService } from '../../lib/blogService';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import BlogCTA from '../components/BlogCTA';
import styles from './page.module.css';

// ISR configuration - regenerate every hour
export const revalidate = 3600;

// Generate static params for all blog posts
export async function generateStaticParams() {
  try {
    const posts = await blogService.getAllPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.warn('Failed to generate static params for blog posts:', error.message);
    return [];
  }
}

// Get recent posts for the blog index
async function getPosts() {
  try {
    // Use the efficient getRecentPosts method that limits at the database level
    return await blogService.getRecentPosts(10);
  } catch (error) {
    console.warn('Failed to fetch blog posts:', error.message);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dance Blog</h1>
        <p className={styles.subtitle}>
          Discover tips, tutorials, and insights to elevate your dance journey
        </p>
      </div>

      {posts.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📝</div>
          <h2 className={styles.emptyTitle}>No posts yet</h2>
          <p className={styles.emptyText}>
            We&apos;re working on some amazing dance content. Check back soon!
          </p>
        </div>
      ) : (
        <div className={styles.postsGrid}>
          {posts.map((post) => (
            <article key={post.id} className={styles.postCard}>
              <Link href={`/blog/${post.slug}`} className={styles.postLink}>
                {post.featuredImage && (
                  <div className={styles.imageContainer}>
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      className={styles.featuredImage}
                      width={400}
                      height={250}
                    />
                  </div>
                )}
                
                <div className={styles.postContent}>
                  <div className={styles.postMeta}>
                    <span className={styles.category}>{post.category}</span>
                    <span className={styles.readTime}>{post.readTime} min read</span>
                  </div>
                  
                  <h2 className={styles.postTitle}>{post.title}</h2>
                  <p className={styles.postExcerpt}>{post.excerpt}</p>
                  
                  <div className={styles.postFooter}>
                    <div className={styles.authorInfo}>
                      <span className={styles.author}>By {post.author}</span>
                      {post.character && (
                        <span className={styles.character}>• {post.character}</span>
                      )}
                      <span className={styles.date}>
                        {format(new Date(post.publishedAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    
                    {post.viewCount > 0 && (
                      <span className={styles.viewCount}>
                        {post.viewCount} views
                      </span>
                    )}
                  </div>
                  
                  {post.tags && post.tags.length > 0 && (
                    <div className={styles.tags}>
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className={styles.tag}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}

      {/* CTA Component */}
      <BlogCTA />
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata() {
  return {
    title: 'Dance Blog - Tips, Tutorials & Insights | Sway Quest',
    description: 'Discover expert dance tips, tutorials, and insights to improve your skills. From beginner moves to advanced techniques, elevate your dance journey with our comprehensive blog.',
    keywords: 'dance blog, dance tips, dance tutorials, dance improvement, dance skills, dance training',
    openGraph: {
      title: 'Dance Blog - Tips, Tutorials & Insights',
      description: 'Discover expert dance tips, tutorials, and insights to improve your skills.',
      type: 'website',
      url: 'https://www.sway.quest//blog',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Dance Blog - Tips, Tutorials & Insights',
      description: 'Discover expert dance tips, tutorials, and insights to improve your skills.',
    },
  };
}
