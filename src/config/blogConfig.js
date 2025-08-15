// Blog Configuration for Sway Quest
// This file contains all the settings for blog post generation

export const blogConfig = {
  // Blog Topics - Dance-focused content
  topics: [
    "10 Essential Dance Tips for Beginners",
    "How to Improve Your Dance Rhythm and Timing",
    "Best Dance Styles for Fitness and Weight Loss",
    "Dance Moves That Build Core Strength",
    "How to Overcome Dance Performance Anxiety",
    "Dance Warm-up Routines for Injury Prevention",
    "Street Dance vs Studio Dance: Which is Right for You?",
    "How to Learn Dance Choreography Faster",
    "Dance Music Genres and Their Unique Styles",
    "Building Confidence Through Dance",
    "Dance Training for Different Body Types",
    "How to Practice Dance at Home Effectively",
    "Dance Competition Preparation Guide",
    "Dance History: From Traditional to Modern Styles",
    "Dance and Mental Health Benefits",
    "How to Choose the Right Dance Shoes",
    "Dance Partner Work: Communication and Trust",
    "Dance Photography: Capturing Movement",
    "Dance Nutrition: Fueling Your Performance",
    "Dance Injury Prevention and Recovery",
    "Dance for Kids: Building Coordination and Confidence",
    "Dance and Cultural Expression",
    "Professional Dance Career Paths",
    "Dance Technology: Apps and Tools for Dancers",
    "Dance Community Building and Networking",
    "Dance and Social Media: Building Your Brand",
    "Dance Education: Formal vs Informal Learning",
    "Dance and Aging: Staying Active Through Movement",
    "Dance Therapy: Healing Through Movement"
  ],

  // Tone and Style Configuration
  tone: {
    primary: "friendly and encouraging",
    secondary: "informative and educational",
    voice: "conversational and approachable",
    audience: "dance enthusiasts of all levels",
    style: "engaging and motivational"
  },

  // Content Structure
  structure: {
    wordCount: {
      min: 800,
      max: 1200,
      target: 1000
    },
    sections: [
      "introduction",
      "keyTakeaways",
      "mainContent",
      "practicalTips",
      "faq",
      "conclusion"
    ],
    includeFAQ: true,
    includeKeyTakeaways: true,
    includeInternalLinks: true
  },

  // SEO Configuration
  seo: {
    titleLength: {
      min: 40,
      max: 60,
      target: 50
    },
    descriptionLength: {
      min: 120,
      max: 160,
      target: 150
    },
    keywords: [
      "dance tips",
      "dance tutorial",
      "dance training",
      "dance improvement",
      "dance skills",
      "dance practice",
      "dance moves",
      "dance technique",
      "dance fitness",
      "dance performance",
      "dance choreography",
      "dance styles",
      "dance beginner",
      "dance intermediate",
      "dance advanced"
    ]
  },

  // Categories for Blog Posts
  categories: [
    "dance-tips",
    "dance-tutorials", 
    "dance-fitness",
    "dance-technique",
    "dance-performance",
    "dance-education",
    "dance-lifestyle",
    "dance-health",
    "dance-culture",
    "dance-business"
  ],

  // Tags for Categorization
  tags: [
    "beginner",
    "intermediate", 
    "advanced",
    "technique",
    "fitness",
    "performance",
    "choreography",
    "rhythm",
    "timing",
    "posture",
    "warmup",
    "injury-prevention",
    "confidence",
    "practice",
    "motivation",
    "style",
    "culture",
    "health",
    "career",
    "community"
  ],

  // Prompt Templates
  prompts: {
    main: (topic) => `
Write a comprehensive dance blog post optimized for SEO and reader engagement.

Topic: ${topic}

Requirements:
- Use markdown formatting with proper H1, H2, H3 headings
- Title should be under 60 characters and include main keyword
- Meta description should be under 160 characters and compelling
- Include "Key Takeaways" section near the top with 3-5 bullet points
- Write 800-1200 words of engaging, informative content
- Include practical tips and actionable advice
- Add FAQ section with 3-4 common questions and clear answers
- Use friendly, encouraging tone throughout
- Include internal link suggestions for related content
- End with a motivating conclusion and call to action

Structure:
1. Introduction (hook the reader)
2. Key Takeaways (bullet points)
3. Main content (2-3 sections with H2 headings)
4. Practical Tips (actionable advice)
5. FAQ (common questions)
6. Conclusion (motivation and next steps)

Tone: Friendly, encouraging, informative, and motivational
Audience: Dance enthusiasts of all skill levels
    `,

    seo: (topic) => `
Generate SEO metadata for this dance blog post:

Topic: ${topic}

Provide:
1. SEO Title (40-60 characters, include main keyword)
2. Meta Description (120-160 characters, compelling and clickable)
3. 5-7 relevant tags for categorization
4. Primary category from: dance-tips, dance-tutorials, dance-fitness, dance-technique, dance-performance, dance-education, dance-lifestyle, dance-health, dance-culture, dance-business
    `,

    image: (title) => `
Generate a description for a featured image for this dance blog post:

Title: ${title}

The image should be:
- High quality and professional
- Related to dance and movement
- Suitable for social media sharing
- Engaging and visually appealing
- Representative of the post content
    `
  },

  // Generation Settings
  generation: {
    model: "gpt-4o-mini",
    temperature: 0.7,
    maxTokens: 2000,
    retryAttempts: 3,
    timeout: 30000
  },

  // Image Generation Settings
  images: {
    width: 1200,
    height: 630,
    backgroundColor: "#0a0a0a",
    textColor: "#ffffff",
    accentColor: "#ff0080",
    fontFamily: "Arial, sans-serif",
    fontSize: {
      title: 48,
      subtitle: 24
    }
  },

  // Database Schema
  schema: {
    primaryKey: "BLOG",
    fields: {
      pk: "BLOG",
      createdAt: "ISO string",
      id: "slugified-title",
      title: "string",
      slug: "string", 
      content: "markdown string",
      excerpt: "string",
      metaDescription: "string",
      author: "string",
      category: "string",
      tags: "array",
      featuredImage: "string",
      ogImage: "string",
      faqSchema: "JSON string",
      readTime: "number",
      viewCount: "number",
      status: "published|draft",
      lastModified: "ISO string"
    }
  }
};

// Helper function to get random topic
export function getRandomTopic() {
  return blogConfig.topics[Math.floor(Math.random() * blogConfig.topics.length)];
}

// Helper function to get topic by date (for scheduled content)
export function getTopicByDate(date = new Date()) {
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  return blogConfig.topics[dayOfYear % blogConfig.topics.length];
}

// Helper function to generate slug from title
export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Helper function to calculate read time
export function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export default blogConfig;
