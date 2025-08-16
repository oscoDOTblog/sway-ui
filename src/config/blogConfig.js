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

  // Dance Central Characters Configuration
  characters: {
    emilia: {
      name: "Emilia",
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
    mo: {
      name: "Mo",
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
    dare: {
      name: "Dare",
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
    angel: {
      name: "Angel",
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
    oblio: {
      name: "Oblio",
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
    bodie: {
      name: "Bodie",
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
    glitch: {
      name: "Glitch & Katalina",
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

// Helper function to generate unique slug with collision detection
export async function generateUniqueSlug(title, blogService) {
  let baseSlug = generateSlug(title);
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
