'use client';

import { useState, useEffect } from 'react';
import styles from './BlogGenerator.module.css';

export default function BlogGenerator() {
  const [topics, setTopics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [count, setCount] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Fetch available topics and config
  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/blog/generate', {
        headers: {
          'x-admin-password': 'admin-authenticated',
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setTopics(data.topics);
        setCategories(data.categories);
        setTags(data.tags);
      }
    } catch (error) {
      console.error('Error fetching config:', error);
    }
  };

  const generateBlogPost = async () => {
    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const topic = customTopic || selectedTopic;
      
      if (!topic) {
        setError('Please select or enter a topic');
        setIsGenerating(false);
        return;
      }

      const response = await fetch('/api/blog/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': 'admin-authenticated',
        },
        body: JSON.stringify({
          topic: topic,
          count: count
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
        setCustomTopic('');
        setSelectedTopic('');
      } else {
        setError(data.error || 'Failed to generate blog post');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Topic Selection</h2>
          
          <div className={styles.topicOptions}>
            <div className={styles.option}>
              <label className={styles.label}>
                <input
                  type="radio"
                  name="topicType"
                  value="preset"
                  checked={!customTopic}
                  onChange={() => setCustomTopic('')}
                  className={styles.radio}
                />
                Use Preset Topic
              </label>
              
              {!customTopic && (
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className={styles.select}
                  disabled={isGenerating}
                >
                  <option value="">Select a topic...</option>
                  {topics.map((topic, index) => (
                    <option key={index} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className={styles.option}>
              <label className={styles.label}>
                <input
                  type="radio"
                  name="topicType"
                  value="custom"
                  checked={!!customTopic}
                  onChange={() => setSelectedTopic('')}
                  className={styles.radio}
                />
                Custom Topic
              </label>
              
              {!!customTopic && (
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="Enter your custom topic..."
                  className={styles.input}
                  disabled={isGenerating}
                />
              )}
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Generation Settings</h2>
          
          <div className={styles.setting}>
            <label className={styles.label}>Number of Posts:</label>
            <select
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className={styles.select}
              disabled={isGenerating}
            >
              <option value={1}>1 Post</option>
              <option value={2}>2 Posts</option>
              <option value={3}>3 Posts</option>
              <option value={4}>4 Posts</option>
              <option value={5}>5 Posts</option>
            </select>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Available Categories</h2>
          <div className={styles.tags}>
            {categories.map((category, index) => (
              <span key={index} className={styles.tag}>
                {category}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Available Tags</h2>
          <div className={styles.tags}>
            {tags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={generateBlogPost}
          disabled={isGenerating || (!selectedTopic && !customTopic)}
          className={styles.generateButton}
        >
          {isGenerating ? 'Generating...' : 'Generate Blog Post'}
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className={styles.result}>
          <h3>Generation Result</h3>
          
          {result.summary ? (
            <div className={styles.summary}>
              <h4>Summary</h4>
              <p>Total: {result.summary.total}</p>
              <p>Successful: {result.summary.successful}</p>
              <p>Failed: {result.summary.failed}</p>
              
              <h4>Details</h4>
              {result.results.map((item, index) => (
                <div key={index} className={styles.resultItem}>
                  <p className={item.success ? styles.success : styles.failure}>
                    {item.success ? '✅' : '❌'} {item.message || item.error}
                  </p>
                  {item.post && (
                    <div className={styles.postInfo}>
                      <p><strong>Title:</strong> {item.post.title}</p>
                      <p><strong>Slug:</strong> {item.post.slug}</p>
                      <p><strong>Category:</strong> {item.post.category}</p>
                      <p><strong>Read Time:</strong> {item.post.readTime} minutes</p>
                      <a 
                        href={`/blog/${item.post.slug}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.viewLink}
                      >
                        View Post
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.singleResult}>
              <p className={result.success ? styles.success : styles.failure}>
                {result.success ? '✅' : '❌'} {result.message || result.error}
              </p>
              {result.post && (
                <div className={styles.postInfo}>
                  <p><strong>Title:</strong> {result.post.title}</p>
                  <p><strong>Slug:</strong> {result.post.slug}</p>
                  <p><strong>Category:</strong> {result.post.category}</p>
                  <p><strong>Read Time:</strong> {result.post.readTime} minutes</p>
                  <a 
                    href={`/blog/${result.post.slug}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.viewLink}
                  >
                    View Post
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
