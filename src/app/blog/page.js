'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import BlogCTA from '../components/BlogCTA';
import styles from './page.module.css';

// Blog page component with pagination
export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const postsPerPage = 12;

  // Load initial posts
  useEffect(() => {
    loadPosts();
  }, []);

  // Load posts from API
  const loadPosts = async (pageNum = 1, append = false) => {
    try {
      const isInitialLoad = pageNum === 1;
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await fetch(`/api/blog?page=${pageNum}&limit=${postsPerPage}`);
      const data = await response.json();

      if (data.success) {
        if (append) {
          setPosts(prevPosts => [...prevPosts, ...data.posts]);
        } else {
          setPosts(data.posts);
        }
        
        // Check if there are more posts
        setHasMore(data.posts.length === postsPerPage);
        setPage(pageNum);
      } else {
        console.error('Failed to load posts:', data.error);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load more posts
  const loadMore = () => {
    loadPosts(page + 1, true);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Dance Blog</h1>
          <p className={styles.subtitle}>
            Discover tips, tutorials, and insights to elevate your dance journey
          </p>
        </div>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading posts...</p>
        </div>
      </div>
    );
  }

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
        <>
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

          {/* Load More Button */}
          {hasMore && (
            <div className={styles.loadMoreContainer}>
              <button 
                onClick={loadMore}
                disabled={loadingMore}
                className={styles.loadMoreButton}
              >
                {loadingMore ? (
                  <>
                    <div className={styles.buttonSpinner}></div>
                    Loading...
                  </>
                ) : (
                  'See More Posts'
                )}
              </button>
            </div>
          )}
        </>
      )}

      {/* CTA Component */}
      <BlogCTA />
    </div>
  );
}
