// Blog Configuration for Sway Quest
// This file contains all the settings for blog post generation

export const blogConfig = {
  // Blog Topics - SEO-optimized dance content organized by categories
  topics: {
    // 🏠 Learn Dance at Home (high SEO potential)
    homeLearning: [
      "The Best Online Dance Classes for Beginners in 2025",
      "How to Learn Hip Hop Dance at Home Without a Teacher",
      "Beginner Ballet at Home: A Step-by-Step Guide",
      "Zumba at Home: Burn Calories While Having Fun",
      "Top 5 YouTube Channels to Learn Dance Online",
      "How to Create the Perfect Home Dance Practice Space",
      "Learn Dance at Home: Complete Beginner's Guide",
      "Virtual Dance Classes: What to Expect and How to Succeed"
    ],

    // 💪 Dance for Fitness & Health
    fitness: [
      "Best Dance Styles for Weight Loss and Fitness",
      "Zumba vs. Aerobics: Which is Better for Burning Calories?",
      "Dance Workouts You Can Do in 15 Minutes a Day",
      "5 Dance Moves That Double as Full-Body Workouts",
      "Dancing for Mental Health: Stress Relief Through Movement",
      "Dance Cardio: High-Energy Workouts That Don't Feel Like Exercise",
      "Dance for Weight Loss: How Many Calories Can You Burn?",
      "Dance Fitness Classes: What to Expect Your First Time"
    ],

    // 🎶 Dance Styles & Trends
    styles: [
      "Hip Hop Dance Basics for Beginners",
      "Shuffle Dance Tutorial: Learn the Viral TikTok Moves",
      "Salsa Dance for Beginners: Step-by-Step Guide",
      "Ballet for Adults: Can You Start at Any Age?",
      "Top 10 Most Popular Dance Styles in the World Right Now",
      "Pole Dance for Fitness: What to Know Before You Start",
      "Contemporary Dance: Understanding the Art Form",
      "Jazz Dance Fundamentals: From Broadway to Street"
    ],

    // 🧠 Skill Building & Improvement
    skills: [
      "How to Learn Dance Choreography Faster",
      "Top Drills to Improve Dance Rhythm and Timing",
      "How to Freestyle Dance Without Feeling Awkward",
      "Daily Habits That Make You a Better Dancer",
      "How to Master Turns and Spins in Dance",
      "How to Memorize Complex Dance Moves",
      "Dance Technique: Building a Strong Foundation",
      "How to Improve Dance Flexibility and Range of Motion"
    ],

    // 👶 Dance by Age Group
    ageGroups: [
      "Dance for Kids: Fun At-Home Activities to Build Coordination",
      "Dance for Teens: Styles That Build Confidence",
      "Dance for Adults: Starting Your Journey Later in Life",
      "Dance for Seniors: Staying Active Through Movement",
      "Toddler Dance Classes: What to Look For",
      "Teen Dance Programs: Building Skills and Self-Esteem",
      "Adult Beginner Dance: It's Never Too Late to Start"
    ],

    // 🎭 Performance & Lifestyle
    performance: [
      "How to Prepare for Your First Dance Competition",
      "Dance Costumes on a Budget: Tips for Beginners",
      "Stage Confidence: Overcoming Performance Anxiety",
      "Building a Dance Career: From Amateur to Professional",
      "How to Create Viral Dance Content on TikTok",
      "Dance Photography: Capturing Movement and Emotion",
      "Dance Auditions: How to Stand Out and Succeed",
      "Dance Studio Etiquette: What Every Dancer Should Know"
    ],

    // ⚡ Tech, Culture & Community
    culture: [
      "Top 10 Dance Apps That Can Improve Your Skills",
      "A Beginner's Guide to Cultural Dance Styles Around the World",
      "The Evolution of Hip Hop Dance: From the Streets to TikTok",
      "How Social Media is Changing the Way We Learn Dance",
      "The Future of Virtual Reality Dance Lessons",
      "Dance History: From Traditional to Modern Styles",
      "Cultural Dance Traditions: Preserving Heritage Through Movement",
      "Dance and Technology: How Apps Are Revolutionizing Learning"
    ],

    // 🏥 Health & Wellness
    wellness: [
      "Dance Warm-up Routines for Injury Prevention",
      "Dance Injury Prevention and Recovery",
      "Dance Nutrition: Fueling Your Performance",
      "Dance Therapy: Healing Through Movement",
      "Dance and Mental Health: The Therapeutic Benefits",
      "Dance for Stress Relief: Finding Peace Through Movement",
      "Dance and Physical Therapy: Rehabilitation Through Movement",
      "Dance for Anxiety: How Movement Can Calm Your Mind"
    ],

    // 🎵 Music & Rhythm
    music: [
      "Dance Music Genres and Their Unique Styles",
      "How to Find the Beat in Any Song",
      "Dance to Different Music Genres: A Complete Guide",
      "Rhythm Training: Exercises to Improve Your Musicality",
      "Dance and Music Theory: Understanding the Connection",
      "How to Choose the Right Music for Your Dance Routine",
      "Dance to World Music: Exploring Global Rhythms"
    ]
  },

  // Dance Central Characters Configuration
  characters: {
    luna: {
      name: "Luna",
      title: "The Cheerleader / Pop Princess",
      tone: "peppy, encouraging, full of sparkle",
      sentenceStyle: "Lots of exclamation points, bubbly language, upbeat rhythm",
      feedbackStyle: "Compliments first, soft correction, framed as 'you've already got this'",
      catchphrases: [
        "Yes! That's it, superstar!",
        "Shine brighter, don't be shy!",
        "One more time — with extra sparkle.",
        "You're absolutely crushing it!",
        "Let's make this dance floor sparkle!"
      ],
      writingStyle: "enthusiastic, encouraging, uses lots of exclamation marks, bubbly and positive",
      personality: "energetic cheerleader who sees potential in everyone"
    },
    marcus: {
      name: "Marcus",
      title: "The Smooth Operator / R&B Cool",
      tone: "laid-back, confident, smooth-talker",
      sentenceStyle: "Chill pacing, longer sentences, easy-flowing words",
      feedbackStyle: "Calms nerves, makes mistakes feel minor, focuses on groove",
      catchphrases: [
        "Relax. The beat's already in you.",
        "Don't force it — let it flow.",
        "Smooth, clean, unstoppable.",
        "Feel the rhythm, let it guide you.",
        "You've got the groove, now own it."
      ],
      writingStyle: "smooth, flowing, confident, uses longer sentences, chill and relaxed",
      personality: "cool and collected mentor who emphasizes flow and groove"
    },
    alex: {
      name: "Alex",
      title: "The Cocky Showman",
      tone: "bold, cocky, always challenging",
      sentenceStyle: "Short bursts, teasing jabs, hype-laced dares",
      feedbackStyle: "Pushes hard, frames mistakes as 'you can do better than that'",
      catchphrases: [
        "That all you got? Show me the real you!",
        "Go big or go home!",
        "Stick the landing — or don't even bother.",
        "You call that a move? Let's see what you're really made of!",
        "Time to step up your game!"
      ],
      writingStyle: "bold, challenging, uses short punchy sentences, confident and demanding",
      personality: "confident showman who pushes dancers to their limits"
    },
    zara: {
      name: "Zara",
      title: "The Edgy Rebel / Punk Attitude",
      tone: "sharp, rebellious, witty",
      sentenceStyle: "Sarcasm + attitude, sprinkled with encouragement",
      feedbackStyle: "Points out errors bluntly, then hypes you to fix them with flair",
      catchphrases: [
        "Messy? Yeah. But I've seen worse.",
        "Make it raw, make it real.",
        "If you fall, fall loud.",
        "That was rough, but I like your style.",
        "Break the rules, but make it look good."
      ],
      writingStyle: "edgy, sarcastic, rebellious, uses attitude and wit, honest but encouraging",
      personality: "rebellious spirit who values authenticity and raw energy"
    },
    kai: {
      name: "Kai",
      title: "The Mysterious Rival",
      tone: "calm, enigmatic, mentor-like",
      sentenceStyle: "Poetic metaphors, longer flowing sentences, cryptic edge",
      feedbackStyle: "Abstract, focuses on artistry and presence more than technique",
      catchphrases: [
        "Your steps are loud, but your silence is louder.",
        "Control the air around you.",
        "Dance as if the world is watching.",
        "The space between moves speaks volumes.",
        "Find the story in your movement."
      ],
      writingStyle: "poetic, philosophical, uses metaphors, mysterious and profound",
      personality: "enigmatic mentor who focuses on artistry and presence"
    },
    jordan: {
      name: "Jordan",
      title: "The Energetic Bro / Party Starter",
      tone: "fun, sporty, hype like a big brother",
      sentenceStyle: "Casual slang, lots of hype words, friendly teases",
      feedbackStyle: "Big energy, builds confidence, makes practice feel like a party",
      catchphrases: [
        "Bro, that was fire!",
        "C'mon, louder steps, bigger moves!",
        "Don't think — just vibe!",
        "You're killing it out there!",
        "Let's turn this up a notch!"
      ],
      writingStyle: "energetic, casual, uses slang and hype words, friendly and encouraging",
      personality: "energetic big brother who makes everything feel like a party"
    },
    rio: {
      name: "Rio & Maya",
      title: "The DJ Duo",
      tone: "fast, fun, chaotic duo banter",
      sentenceStyle: "Ping-pong commentary, constant jokes, interruptions",
      feedbackStyle: "Playful roast + hype combo, always bringing energy",
      catchphrases: [
        "Oof, busted that move — but I liked it!",
        "Yeah, messy, but kinda spicy!",
        "One more time — remix edition!",
        "That was wild, we love it!",
        "Keep the energy high, keep the vibes flowing!"
      ],
      writingStyle: "dynamic, playful, uses duo commentary style, energetic and fun",
      personality: "dynamic DJ duo who bring constant energy and playful commentary"
    }
  },

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
    main: (topic, character = null) => {
      const characterInfo = character ? blogConfig.characters[character] : null;
      const characterPrompt = characterInfo ? `
Character: ${characterInfo.name} - ${characterInfo.title}
Writing Style: ${characterInfo.writingStyle}
Tone: ${characterInfo.tone}
Personality: ${characterInfo.personality}
Catchphrases to use naturally: ${characterInfo.catchphrases.join(', ')}

Write this blog post in ${characterInfo.name}'s unique voice and style. Use their characteristic tone, sentence structure, and personality throughout the content. Naturally incorporate their catchphrases where appropriate. Make the reader feel like ${characterInfo.name} is personally coaching them through this dance topic.
      ` : `
Tone: Friendly, encouraging, informative, and motivational
      `;

      return `
Write a comprehensive dance blog post optimized for SEO and reader engagement.

Topic: ${topic}

${characterPrompt}

Requirements:
- Use markdown formatting with proper H1, H2, H3 headings
- Title should be under 60 characters and include main keyword
- Meta description should be under 160 characters and compelling
- Include "Key Takeaways" section near the top with 3-5 bullet points
- Write 800-1200 words of engaging, informative content
- Include practical tips and actionable advice
- Add FAQ section with 3-4 common questions and clear answers
- Use the specified character's tone and style throughout
- Include internal link suggestions for related content
- End with a motivating conclusion and call to action

Structure:
1. Introduction (hook the reader)
2. Key Takeaways (bullet points)
3. Main content (2-3 sections with H2 headings)
4. Practical Tips (actionable advice)
5. FAQ (common questions)
6. Conclusion (motivation and next steps)

Audience: Dance enthusiasts of all skill levels
      `;
    },

    seo: (topic) => `
Generate SEO metadata for this dance blog post:

Topic: ${topic}

This function is now handled automatically by the AI system which will:
1. Generate an optimized SEO title (40-60 characters)
2. Create a compelling meta description (120-160 characters)
3. Auto-select the most appropriate category from available options
4. Generate 5-8 relevant tags based on content focus and skill level

The system analyzes the topic content and automatically categorizes it appropriately.
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

// Helper function to get all topics as a flat array
export function getAllTopics() {
  const allTopics = [];
  Object.values(blogConfig.topics).forEach(category => {
    allTopics.push(...category);
  });
  return allTopics;
}

// Helper function to get random topic
export function getRandomTopic() {
  const allTopics = getAllTopics();
  return allTopics[Math.floor(Math.random() * allTopics.length)];
}

// Helper function to get topic by date (for scheduled content)
export function getTopicByDate(date = new Date()) {
  const allTopics = getAllTopics();
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  return allTopics[dayOfYear % allTopics.length];
}

// Helper function to get topic by category
export function getTopicByCategory(category) {
  return blogConfig.topics[category] || [];
}

// Helper function to get random topic from specific category
export function getRandomTopicFromCategory(category) {
  const categoryTopics = getTopicByCategory(category);
  if (categoryTopics.length === 0) return null;
  return categoryTopics[Math.floor(Math.random() * categoryTopics.length)];
}

// Helper function to get topic by category rotation (for daily posting)
export function getTopicByCategoryRotation(date = new Date()) {
  const categories = Object.keys(blogConfig.topics);
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const categoryIndex = dayOfYear % categories.length;
  const category = categories[categoryIndex];
  return getRandomTopicFromCategory(category);
}

// Helper function to get all category names
export function getCategoryNames() {
  return Object.keys(blogConfig.topics);
}

// Helper function to get random character
export function getRandomCharacter() {
  const characterKeys = Object.keys(blogConfig.characters);
  return characterKeys[Math.floor(Math.random() * characterKeys.length)];
}

// Helper function to get character by date (for scheduled content)
export function getCharacterByDate(date = new Date()) {
  const characterKeys = Object.keys(blogConfig.characters);
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  return characterKeys[dayOfYear % characterKeys.length];
}

// Helper function to get character info
export function getCharacterInfo(characterKey) {
  return blogConfig.characters[characterKey] || null;
}

// Helper function to get all character names
export function getAllCharacterNames() {
  return Object.values(blogConfig.characters).map(char => char.name);
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

// Helper function to generate date-based slug
export function generateDateBasedSlug(title, date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const datePrefix = `${year}-${month}-${day}`;
  
  const baseSlug = generateSlug(title);
  
  return `${datePrefix}-${baseSlug}`;
}

// Helper function to generate unique slug with collision detection
export async function generateUniqueSlug(title, blogService, date = new Date()) {
  let baseSlug = generateDateBasedSlug(title, date);
  let slug = baseSlug;
  let counter = 1;
  
  // Check if slug exists and append number if needed
  while (true) {
    const existingPost = await blogService.getPostBySlug(slug);
    if (!existingPost) {
      break; // Slug is unique
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
    
    // Prevent infinite loop
    if (counter > 100) {
      slug = `${baseSlug}-${Date.now()}`;
      break;
    }
  }
  
  return slug;
}

// Helper function to generate unique ID
export function generateUniqueId(slug) {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${slug}-${timestamp}-${randomSuffix}`;
}

// Helper function to calculate read time
export function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export default blogConfig;
