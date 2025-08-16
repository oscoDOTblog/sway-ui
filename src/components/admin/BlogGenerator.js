'use client';

import { useState, useEffect } from 'react';
import styles from './BlogGenerator.module.css';

export default function BlogGenerator() {
  const [topics, setTopics] = useState({});
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [characters, setCharacters] = useState({});
  const [topicCategories, setTopicCategories] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [count, setCount] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
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
        setCharacters(data.characters || {});
        setTopicCategories(data.topicCategories || []);
      }
    } catch (error) {
      console.error('Error fetching config:', error);
    }
  };

  const generateBlogPost = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setError(null);
    setResult(null);

    try {
      const topic = customTopic || selectedTopic;
      
      if (!topic) {
        setError('Please select or enter a topic');
        setIsGenerating(false);
        return;
      }

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 1000);

      const response = await fetch('/api/blog/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': 'admin-authenticated',
        },
        body: JSON.stringify({
          topic: topic,
          count: count,
          character: selectedCharacter || undefined,
          category: selectedCategory || undefined
        }),
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);

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
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationProgress(0);
      }, 1000); // Show 100% for a moment before hiding
    }
  };

  return (
    <div className={styles.container}>
      {isGenerating && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingContent}>
            <div className={styles.loadingSpinner}></div>
            <h3 className={styles.loadingTitle}>Creating Your Blog Post</h3>
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${generationProgress}%` }}
                ></div>
              </div>
              <div className={styles.progressText}>{Math.round(generationProgress)}%</div>
            </div>
            
            <div className={styles.loadingSteps}>
              <div className={`${styles.loadingStep} ${generationProgress > 10 ? styles.active : ''}`}>
                <div className={styles.stepIcon}>🤖</div>
                <span>AI is writing your content...</span>
              </div>
              <div className={`${styles.loadingStep} ${generationProgress > 30 ? styles.active : ''}`}>
                <div className={styles.stepIcon}>🎨</div>
                <span>Generating SEO metadata...</span>
              </div>
              <div className={`${styles.loadingStep} ${generationProgress > 50 ? styles.active : ''}`}>
                <div className={styles.stepIcon}>📝</div>
                <span>Creating unique slug...</span>
              </div>
              <div className={`${styles.loadingStep} ${generationProgress > 70 ? styles.active : ''}`}>
                <div className={styles.stepIcon}>💾</div>
                <span>Saving to database...</span>
              </div>
              <div className={`${styles.loadingStep} ${generationProgress > 90 ? styles.active : ''}`}>
                <div className={styles.stepIcon}>📱</div>
                <span>Sending notifications...</span>
              </div>
            </div>
            <p className={styles.loadingNote}>
              This usually takes 30-60 seconds. Please don't close this page.
            </p>
          </div>
        </div>
      )}
      
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
                <>
                  <div className={styles.categorySelection}>
                    <label className={styles.label}>Category (Optional):</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setSelectedTopic('');
                      }}
                      className={styles.select}
                      disabled={isGenerating}
                    >
                      <option value="">All Categories</option>
                      {topicCategories.map((category) => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className={styles.topicSelection}>
                    <label className={styles.label}>Topic:</label>
                    <select
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      className={styles.select}
                      disabled={isGenerating}
                    >
                      <option value="">Select a topic...</option>
                      {selectedCategory && topics[selectedCategory] ? (
                        topics[selectedCategory].map((topic, index) => (
                          <option key={index} value={topic}>
                            {topic}
                          </option>
                        ))
                      ) : (
                        Object.entries(topics).map(([category, categoryTopics]) => (
                          <optgroup key={category} label={category.charAt(0).toUpperCase() + category.slice(1)}>
                            {categoryTopics.map((topic, index) => (
                              <option key={`${category}-${index}`} value={topic}>
                                {topic}
                              </option>
                            ))}
                          </optgroup>
                        ))
                      )}
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className={styles.option}>
              <label className={styles.label}>
                <input
                  type="radio"
                  name="topicType"
                  value="custom"
                  checked={!!customTopic}
                  onChange={() => {
                    setSelectedTopic('');
                    setSelectedCategory('');
                  }}
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

          <div className={styles.setting}>
            <label className={styles.label}>Character (Optional):</label>
            <select
              value={selectedCharacter}
              onChange={(e) => setSelectedCharacter(e.target.value)}
              className={styles.select}
              disabled={isGenerating}
            >
              <option value="">Random Character</option>
              {Object.entries(characters).map(([key, character]) => (
                <option key={key} value={key}>
                  {character.name} - {character.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Auto-Generated Categories & Tags</h2>
          <p className={styles.autoGenNote}>
            Categories and tags are automatically generated by AI based on the blog topic content. 
            The system analyzes each topic and assigns the most appropriate category and relevant tags.
          </p>
          
          <div className={styles.autoGenInfo}>
            <div className={styles.autoGenSection}>
              <h4 className={styles.autoGenTitle}>Available Categories</h4>
              <div className={styles.tags}>
                {categories.map((category, index) => (
                  <span key={index} className={styles.tag}>
                    {category}
                  </span>
                ))}
              </div>
            </div>
            
            <div className={styles.autoGenSection}>
              <h4 className={styles.autoGenTitle}>Sample Tags</h4>
              <div className={styles.tags}>
                {tags.slice(0, 10).map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    {tag}
                  </span>
                ))}
                <span className={styles.moreTags}>+ more auto-generated</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Available Characters</h2>
          <div className={styles.characters}>
            {Object.entries(characters).map(([key, character]) => (
              <div key={key} className={styles.characterCard}>
                <h4 className={styles.characterName}>{character.name}</h4>
                <p className={styles.characterTitle}>{character.title}</p>
                <p className={styles.characterTone}>{character.tone}</p>
                <div className={styles.characterCatchphrases}>
                  {character.catchphrases.slice(0, 2).map((phrase, index) => (
                    <span key={index} className={styles.catchphrase}>
                      "{phrase}"
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={generateBlogPost}
          disabled={isGenerating || (!selectedTopic && !customTopic)}
          className={styles.generateButton}
        >
          {isGenerating ? (
            <div className={styles.loadingButton}>
              <div className={styles.spinner}></div>
              <span>Generating...</span>
            </div>
          ) : (
            'Generate Blog Post'
          )}
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
