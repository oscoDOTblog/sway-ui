'use client';

import { useState, useEffect } from 'react';
import styles from './BlogManager.module.css';

export default function BlogManager() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch all blog posts
  useEffect(() => {
    fetchPosts();
  }, []);

  // Filter posts based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post => 
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        post.author?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [searchTerm, posts]);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/blog', {
        headers: {
          'x-admin-password': 'admin-authenticated',
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.posts || []);
        setFilteredPosts(data.posts || []);
      } else {
        setError('Failed to fetch blog posts');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (post) => {
    setEditingPost({ ...post });
    setError(null);
    setSuccess(null);
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    if (!editingPost) return;
    
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/blog/${editingPost.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': 'admin-authenticated',
        },
        body: JSON.stringify(editingPost),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Post updated successfully!');
        setPosts(posts.map(post => 
          post.slug === editingPost.slug ? editingPost : post
        ));
        setEditingPost(null);
      } else {
        setError(data.error || 'Failed to update post');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Error updating post:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (slug) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    setDeletingSlug(slug);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: 'DELETE',
        headers: {
          'x-admin-password': 'admin-authenticated',
        },
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Post deleted successfully!');
        setPosts(posts.filter(post => post.slug !== slug));
        if (editingPost?.slug === slug) {
          setEditingPost(null);
        }
      } else {
        setError(data.error || 'Failed to delete post');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Error deleting post:', error);
    } finally {
      setIsDeleting(false);
      setDeletingSlug(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.container}>
      {/* Search and Controls */}
      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search posts by title, slug, category, tags, or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <button 
            onClick={fetchPosts}
            className={styles.refreshButton}
            disabled={isLoading}
          >
            {isLoading ? '⏳' : '🔄'}
          </button>
        </div>
        
        <div className={styles.stats}>
          <span>Total: {posts.length}</span>
          <span>Showing: {filteredPosts.length}</span>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className={styles.success}>
          <p>{success}</p>
        </div>
      )}

      {/* Posts Table */}
      <div className={styles.tableContainer}>
        {isLoading ? (
          <div className={styles.loading}>
            <p>Loading posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className={styles.empty}>
            <p>{searchTerm ? 'No posts found matching your search.' : 'No posts found.'}</p>
          </div>
        ) : (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <div className={styles.headerCell}>Title</div>
              <div className={styles.headerCell}>Slug</div>
              <div className={styles.headerCell}>Category</div>
              <div className={styles.headerCell}>Author</div>
              <div className={styles.headerCell}>Published</div>
              <div className={styles.headerCell}>Views</div>
              <div className={styles.headerCell}>Status</div>
              <div className={styles.headerCell}>Actions</div>
            </div>

            {filteredPosts.map((post) => (
              <div key={post.slug} className={`${styles.tableRow} ${deletingSlug === post.slug ? styles.deletingRow : ''}`}>
                {editingPost?.slug === post.slug ? (
                  // Edit Mode
                  <>
                    <div className={styles.cell}>
                      <input
                        type="text"
                        value={editingPost.title}
                        onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                        className={styles.editInput}
                      />
                    </div>
                    <div className={styles.cell}>
                      <input
                        type="text"
                        value={editingPost.slug}
                        onChange={(e) => setEditingPost({...editingPost, slug: e.target.value})}
                        className={styles.editInput}
                      />
                    </div>
                    <div className={styles.cell}>
                      <select
                        value={editingPost.category}
                        onChange={(e) => setEditingPost({...editingPost, category: e.target.value})}
                        className={styles.editSelect}
                      >
                        <option value="dance-tips">Dance Tips</option>
                        <option value="dance-tutorials">Dance Tutorials</option>
                        <option value="dance-fitness">Dance Fitness</option>
                        <option value="dance-technique">Dance Technique</option>
                        <option value="dance-performance">Dance Performance</option>
                        <option value="dance-education">Dance Education</option>
                        <option value="dance-lifestyle">Dance Lifestyle</option>
                        <option value="dance-health">Dance Health</option>
                        <option value="dance-culture">Dance Culture</option>
                        <option value="dance-business">Dance Business</option>
                      </select>
                    </div>
                    <div className={styles.cell}>
                      <input
                        type="text"
                        value={editingPost.author}
                        onChange={(e) => setEditingPost({...editingPost, author: e.target.value})}
                        className={styles.editInput}
                      />
                    </div>
                    <div className={styles.cell}>
                      {formatDate(post.publishedAt)}
                    </div>
                    <div className={styles.cell}>
                      {post.viewCount || 0}
                    </div>
                    <div className={styles.cell}>
                      <select
                        value={editingPost.status}
                        onChange={(e) => setEditingPost({...editingPost, status: e.target.value})}
                        className={styles.editSelect}
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                    <div className={styles.cell}>
                      <div className={styles.actionButtons}>
                        <button
                          onClick={handleSave}
                          disabled={isSaving}
                          className={styles.saveButton}
                        >
                          {isSaving ? 'Saving...' : '💾'}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className={styles.cancelButton}
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  // View Mode
                  <>
                    <div className={styles.cell}>
                      <div className={styles.titleCell}>
                        <strong>{post.title}</strong>
                        {post.excerpt && (
                          <p className={styles.excerpt}>{post.excerpt.substring(0, 100)}...</p>
                        )}
                        {deletingSlug === post.slug && (
                          <p className={styles.deletingText}>🗑️ Deleting post and cleaning up images...</p>
                        )}
                      </div>
                    </div>
                    <div className={styles.cell}>
                      <code className={styles.slug}>{post.slug}</code>
                    </div>
                    <div className={styles.cell}>
                      <span className={styles.category}>{post.category}</span>
                    </div>
                    <div className={styles.cell}>
                      {post.author}
                    </div>
                    <div className={styles.cell}>
                      {formatDate(post.publishedAt)}
                    </div>
                    <div className={styles.cell}>
                      {post.viewCount || 0}
                    </div>
                    <div className={styles.cell}>
                      <span className={`${styles.status} ${styles[post.status]}`}>
                        {post.status}
                      </span>
                    </div>
                    <div className={styles.cell}>
                      <div className={styles.actionButtons}>
                        <button
                          onClick={() => handleEdit(post)}
                          className={styles.editButton}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(post.slug)}
                          disabled={isDeleting}
                          className={`${styles.deleteButton} ${deletingSlug === post.slug ? styles.deleting : ''}`}
                          title={deletingSlug === post.slug ? "Deleting..." : "Delete"}
                        >
                          {deletingSlug === post.slug ? (
                            <span className={styles.deleteSpinner}>🗑️</span>
                          ) : (
                            '🗑️'
                          )}
                        </button>
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.viewButton}
                          title="View"
                        >
                          👁️
                        </a>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
