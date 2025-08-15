import { NextResponse } from 'next/server';
import OpenAI from 'openai';

import { blogService } from '../../../../lib/blogService';
import { blogConfig, getRandomTopic, generateUniqueSlug, generateUniqueId, calculateReadTime } from '../../../../config/blogConfig';


// Initialize OpenAI
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});



// Generate OG image URL for the blog post
function generateOGImageURL(title, slug) {
  try {
    // Use the Vercel OG endpoint
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://swayquest.vercel.app';
    return `${baseUrl}/api/og?title=${encodeURIComponent(title)}&slug=${encodeURIComponent(slug)}`;
  } catch (error) {
    console.error('Error generating OG image URL:', error);
    return null;
  }
}

// Extract FAQ schema from content
function extractFAQSchema(content) {
  try {
    // Look for FAQ section with Q&A format
    const faqSection = content.match(/## FAQ[\s\S]*?(?=##|$)/i);
    if (!faqSection) {
      return null;
    }

    // Extract Q&A pairs
    const qaMatches = [...faqSection[0].matchAll(/Q:\s*(.*?)\nA:\s*(.*?)(?=\nQ:|$)/gs)];
    
    if (qaMatches.length === 0) {
      return null;
    }

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: qaMatches.map((match) => {
        const question = match[1]?.trim();
        const answer = match[2]?.trim();
        
        if (!question || !answer) {
          return null;
        }
        
        return {
          "@type": "Question",
          name: question,
          acceptedAnswer: { 
            "@type": "Answer", 
            text: answer 
          }
        };
      }).filter(Boolean) // Remove null entries
    };

    return faqSchema.mainEntity.length > 0 ? JSON.stringify(faqSchema) : null;
  } catch (error) {
    console.error('Error extracting FAQ schema:', error);
    return null;
  }
}

// Extract content sections
function extractContentSections(content) {
  const sections = {
    title: '',
    excerpt: '',
    content: content,
    metaDescription: ''
  };

  // Extract title from first H1
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    sections.title = titleMatch[1].trim();
  }

  // Extract excerpt (first paragraph after title)
  const paragraphs = content.split('\n\n').filter(p => p.trim() && !p.startsWith('#'));
  if (paragraphs.length > 0) {
    sections.excerpt = paragraphs[0].replace(/[#*`]/g, '').trim().substring(0, 160);
  }

  // Extract meta description from content
  const metaMatch = content.match(/Meta:\s*(.+)/i);
  if (metaMatch) {
    sections.metaDescription = metaMatch[1].trim();
  } else {
    // Generate meta description from excerpt
    sections.metaDescription = sections.excerpt.substring(0, 160);
  }

  return sections;
}

// Generate blog post using OpenAI
async function generateBlogPost(topic = null) {
  try {
    // Use provided topic or get random topic
    const selectedTopic = topic || getRandomTopic();

    console.log(`🎯 Generating blog post for topic: ${selectedTopic}`);

    // Generate main content
    const contentCompletion = await openai.chat.completions.create({
      model: blogConfig.generation.model,
      messages: [
        {
          role: "system",
          content: "You are an expert dance instructor and content creator. Write engaging, informative blog posts that help dancers improve their skills and knowledge."
        },
        {
          role: "user",
          content: blogConfig.prompts.main(selectedTopic)
        }
      ],
      temperature: blogConfig.generation.temperature,
      max_tokens: blogConfig.generation.maxTokens
    });

    const content = contentCompletion.choices[0].message.content;

    // Generate SEO metadata
    const seoCompletion = await openai.chat.completions.create({
      model: blogConfig.generation.model,
      messages: [
        {
          role: "system",
          content: "You are an SEO expert. Generate optimized metadata for dance blog posts."
        },
        {
          role: "user",
          content: blogConfig.prompts.seo(selectedTopic)
        }
      ],
      temperature: 0.5,
      max_tokens: 500
    });

    const seoResponse = seoCompletion.choices[0].message.content;

    // Parse SEO response
    const seoTitleMatch = seoResponse.match(/SEO Title:\s*(.+)/i);
    const metaDescMatch = seoResponse.match(/Meta Description:\s*(.+)/i);
    const tagsMatch = seoResponse.match(/Tags:\s*(.+)/i);
    const categoryMatch = seoResponse.match(/Category:\s*(.+)/i);

    const seoTitle = seoTitleMatch ? seoTitleMatch[1].trim() : selectedTopic;
    const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : `Learn about ${selectedTopic.toLowerCase()}`;
    const tags = tagsMatch ? tagsMatch[1].split(',').map(tag => tag.trim()) : ['dance', 'tips'];
    const category = categoryMatch ? categoryMatch[1].trim() : 'dance-tips';

    // Generate unique slug from SEO title
    const slug = await generateUniqueSlug(seoTitle, blogService);

    // Extract content sections
    const sections = extractContentSections(content);

    // Generate OG image URL
    const ogImagePath = generateOGImageURL(seoTitle, slug);

    // Extract FAQ schema
    const faqSchema = extractFAQSchema(content);

    // Calculate read time
    const readTime = calculateReadTime(content);

    // Prepare blog post data
    const blogPost = {
      id: generateUniqueId(slug),
      title: sections.title || seoTitle,
      slug: slug,
      content: sections.content,
      excerpt: sections.excerpt,
      metaDescription: sections.metaDescription || metaDescription,
      author: "Sway Team",
      category: category,
      tags: tags,
      featuredImage: ogImagePath,
      ogImage: ogImagePath,
      faqSchema: faqSchema,
      readTime: readTime,
      viewCount: 0,
      status: "published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    // Save to DynamoDB
    const savedPost = await blogService.createPost(blogPost);

    console.log(`✅ Blog post generated successfully: ${slug}`);
    
    return {
      success: true,
      post: savedPost,
      message: `Blog post "${seoTitle}" generated and published successfully!`
    };

  } catch (error) {
    console.error('❌ Error generating blog post:', error);
    
    return {
      success: false,
      error: error.message || 'Failed to generate blog post',
      details: error
    };
  }
}

// API Route handlers
export async function POST(request) {
  try {
    const body = await request.json();
    const { topic, count = 1 } = body;

    // Validate count
    if (count > 5) {
      return NextResponse.json(
        { success: false, error: 'Maximum 5 posts can be generated at once' },
        { status: 400 }
      );
    }

    const results = [];

    // Generate specified number of posts
    for (let i = 0; i < count; i++) {
      const result = await generateBlogPost(topic);
      results.push(result);
      
      // Add delay between generations to avoid rate limits
      if (i < count - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // If generating multiple posts, return summary
    if (count > 1) {
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      return NextResponse.json({
        success: true,
        summary: {
          total: count,
          successful,
          failed
        },
        results
      });
    }

    // Single post result
    return NextResponse.json(results[0]);

  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to list available topics
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      topics: blogConfig.topics,
      categories: blogConfig.categories,
      tags: blogConfig.tags,
      config: {
        tone: blogConfig.tone,
        structure: blogConfig.structure,
        generation: blogConfig.generation
      }
    });
  } catch (error) {
    console.error('❌ Error fetching blog config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog configuration' },
      { status: 500 }
    );
  }
}
