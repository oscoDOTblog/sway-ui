import { blogService } from '../../../lib/blogService';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BlogNavigation from '../../../components/BlogNavigation';
import RelatedPosts from '../../../components/RelatedPosts';
import styles from './page.module.css';

// ISR configuration - regenerate every 30 minutes
export const revalidate = 1800;

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

// Get a single blog post and adjacent posts
async function getPost(slug) {
  try {
    const [post, adjacentPosts] = await Promise.all([
      blogService.getPostBySlug(slug),
      blogService.getAdjacentPosts(slug)
    ]);
    
    // If no adjacent posts, get related posts by category
    let relatedPosts = [];
    if (post && (!adjacentPosts.prev && !adjacentPosts.next)) {
      relatedPosts = await blogService.getRelatedPosts(post.category, slug, 3);
    }
    
    return {
      post,
      adjacentPosts,
      relatedPosts
    };
  } catch (error) {
    console.warn('Failed to fetch blog post:', error.message);
    return { post: null, adjacentPosts: { prev: null, next: null }, relatedPosts: [] };
  }
}

export default async function BlogPostPage({ params }) {
  const { post, adjacentPosts, relatedPosts } = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <article className={styles.article}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.breadcrumb}>
            <Link href="/blog" className={styles.breadcrumbLink}>
              ← Back to Blog
            </Link>
          </div>
          
          <div className={styles.meta}>
            <span className={styles.category}>{post.category}</span>
            <span className={styles.readTime}>{post.readTime} min read</span>
            {post.viewCount > 0 && (
              <span className={styles.viewCount}>{post.viewCount} views</span>
            )}
          </div>
          
          <h1 className={styles.title}>{post.title}</h1>
          
          {post.excerpt && (
            <p className={styles.excerpt}>{post.excerpt}</p>
          )}
          
          <div className={styles.authorInfo}>
            <span className={styles.author}>By {post.author}</span>
            <span className={styles.date}>
              {format(new Date(post.publishedAt), 'MMMM dd, yyyy')}
            </span>
          </div>
          
          {post.tags && post.tags.length > 0 && (
            <div className={styles.tags}>
              {post.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className={styles.featuredImageContainer}>
            <img
              src={post.featuredImage}
              alt={post.title}
              className={styles.featuredImage}
            />
          </div>
        )}

        {/* Content */}
        <div className={styles.content}>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            className={styles.markdown}
            components={{
              h1: ({ children }) => <h1 className={styles.markdownH1}>{children}</h1>,
              h2: ({ children }) => <h2 className={styles.markdownH2}>{children}</h2>,
              h3: ({ children }) => <h3 className={styles.markdownH3}>{children}</h3>,
              h4: ({ children }) => <h4 className={styles.markdownH4}>{children}</h4>,
              p: ({ children }) => <p className={styles.markdownP}>{children}</p>,
              ul: ({ children }) => <ul className={styles.markdownUl}>{children}</ul>,
              ol: ({ children }) => <ol className={styles.markdownOl}>{children}</ol>,
              li: ({ children }) => <li className={styles.markdownLi}>{children}</li>,
              blockquote: ({ children }) => <blockquote className={styles.markdownBlockquote}>{children}</blockquote>,
              code: ({ children, className }) => {
                const isInline = !className;
                return isInline ? (
                  <code className={styles.markdownInlineCode}>{children}</code>
                ) : (
                  <code className={styles.markdownCode}>{children}</code>
                );
              },
              pre: ({ children }) => <pre className={styles.markdownPre}>{children}</pre>,
              a: ({ href, children }) => (
                <a href={href} className={styles.markdownLink} target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
              img: ({ src, alt }) => (
                <img src={src} alt={alt} className={styles.markdownImage} loading="lazy" />
              ),
              table: ({ children }) => <table className={styles.markdownTable}>{children}</table>,
              th: ({ children }) => <th className={styles.markdownTh}>{children}</th>,
              td: ({ children }) => <td className={styles.markdownTd}>{children}</td>,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Navigation */}
        <BlogNavigation prev={adjacentPosts.prev} next={adjacentPosts.next} />
        
        {/* Related Posts (shown when no adjacent posts) */}
        {(!adjacentPosts.prev && !adjacentPosts.next) && relatedPosts.length > 0 && (
          <RelatedPosts posts={relatedPosts} currentSlug={post.slug} />
        )}

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.shareSection}>
              <h3 className={styles.shareTitle}>Share this post</h3>
              <div className={styles.shareButtons}>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://swayquest.vercel.app'}/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.shareButton}
                >
                  Twitter
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://swayquest.vercel.app'}/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.shareButton}
                >
                  Facebook
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://swayquest.vercel.app'}/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.shareButton}
                >
                  LinkedIn
                </a>
              </div>
            </div>
            
            <div className={styles.backToBlog}>
              <Link href="/blog" className={styles.backToBlogLink}>
                ← Back to Blog
              </Link>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { post } = await getPost(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | Sway Quest',
    };
  }

  return {
    title: `${post.seoTitle || post.title} | Sway Quest`,
    description: post.seoDescription || post.excerpt,
    keywords: post.tags ? post.tags.join(', ') : 'dance, dance tips, dance tutorial',
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      type: 'article',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://swayquest.vercel.app'}/blog/${post.slug}`,
      images: post.featuredImage ? [post.featuredImage] : [],
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://swayquest.vercel.app'}/blog/${post.slug}`,
    },
  };
}
