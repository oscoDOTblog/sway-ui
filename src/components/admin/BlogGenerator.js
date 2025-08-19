'use client';

import { useState, useEffect } from 'react';
import styles from './BlogGenerator.module.css';

export default function BlogGenerator() {
  const [topics, setTopics] = useState({});
  const [characters, setCharacters] = useState({});
  const [topicCategories, setTopicCategories] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState('');
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

      // Simulate progress updates based on actual server steps
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 8;
        });
      }, 1200);

      const response = await fetch('/api/blog/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': 'admin-authenticated',
        },
        body: JSON.stringify({
          topic: topic,
          count: 1,
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

  const handleCharacterSelect = (characterKey) => {
    setSelectedCharacter(characterKey === selectedCharacter ? '' : characterKey);
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
              <div className={`${styles.loadingStep} ${generationProgress > 5 ? styles.active : ''}`}>
                <div className={styles.stepIcon}>🤖</div>
                <span>AI is writing your content...</span>
              </div>
              <div className={`${styles.loadingStep} ${generationProgress > 20 ? styles.active : ''}`}>
                <div className={styles.stepIcon}>📝</div>
                <span>Generating SEO metadata...</span>
              </div>
              <div className={`${styles.loadingStep} ${generationProgress > 35 ? styles.active : ''}`}>
                <div className={styles.stepIcon}>🔗</div>
                <span>Creating unique slug...</span>
              </div>
              <div className={`${styles.loadingStep} ${generationProgress > 50 ? styles.active : ''}`}>
                <div className={styles.stepIcon}>🎨</div>
                <span>Generating AI image...</span>
              </div>
              <div className={`${styles.loadingStep} ${generationProgress > 65 ? styles.active : ''}`}>
                <div className={styles.stepIcon}>☁️</div>
                <span>Uploading image to S3...</span>
              </div>
              <div className={`${styles.loadingStep} ${generationProgress > 80 ? styles.active : ''}`}>
                <div className={styles.stepIcon}>💾</div>
                <span>Saving to database...</span>
              </div>
              <div className={`${styles.loadingStep} ${generationProgress > 90 ? styles.active : ''}`}>
                <div className={styles.stepIcon}>📱</div>
                <span>Sending notifications...</span>
              </div>
            </div>
            <p className={styles.loadingNote}>
              This usually takes 30-60 seconds. Please don&apos;t close this page.
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
          <h2 className={styles.sectionTitle}>Character Selection</h2>
          <p className={styles.characterNote}>
            Click on a character to select them, or leave unselected for a random character.
          </p>
          <div className={styles.characters}>
            {Object.entries(characters).map(([key, character]) => (
              <div 
                key={key} 
                className={`${styles.characterCard} ${selectedCharacter === key ? styles.selected : ''}`}
                onClick={() => handleCharacterSelect(key)}
              >
                <h4 className={styles.characterName}>{character.name}</h4>
                <p className={styles.characterTitle}>{character.title}</p>
                <p className={styles.characterTone}>{character.tone}</p>
                <div className={styles.characterCatchphrases}>
                  {character.catchphrases.slice(0, 2).map((phrase, index) => (
                    <span key={index} className={styles.catchphrase}>
                      &quot;{phrase}&quot;
                    </span>
                  ))}
                </div>
                {selectedCharacter === key && (
                  <div className={styles.selectedIndicator}>✓ Selected</div>
                )}
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
