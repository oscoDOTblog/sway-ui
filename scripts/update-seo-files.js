#!/usr/bin/env node

/**
 * SEO Files Update Script
 * Updates sitemap.xml and other SEO files with current blog posts
 */

const fs = require('fs');
const path = require('path');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

// AWS Configuration
const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(dynamoClient);
const BLOG_POSTS_TABLE = process.env.BLOG_POSTS_TABLE || 'sway-blog-posts';

// Site configuration
const SITE_URL = 'https://swayquest.com';
const CURRENT_DATE = new Date().toISOString().split('T')[0];

async function getAllBlogPosts() {
  try {
    console.log('📊 Fetching all blog posts from DynamoDB...');
    
    const command = new ScanCommand({
      TableName: BLOG_POSTS_TABLE,
      ProjectionExpression: 'slug, title, updatedAt, category, tags',
    });

    const response = await docClient.send(command);
    const posts = response.Items || [];

    console.log(`✅ Found ${posts.length} blog posts`);
    return posts;
  } catch (error) {
    console.error('❌ Error fetching blog posts:', error);
    return [];
  }
}

function generateSitemapXML(posts) {
  console.log('🗺️  Generating sitemap.xml...');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">

  <!-- Homepage -->
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- About Page -->
  <url>
    <loc>${SITE_URL}/about</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Contact Page -->
  <url>
    <loc>${SITE_URL}/contact</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Blog Index -->
  <url>
    <loc>${SITE_URL}/blog</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- LLM Files for AI Systems -->
  <url>
    <loc>${SITE_URL}/llms.txt</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>${SITE_URL}/llms-full.txt</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <!-- Blog Categories -->
  <url>
    <loc>${SITE_URL}/blog/category/home-learning</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${SITE_URL}/blog/category/fitness</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${SITE_URL}/blog/category/styles</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${SITE_URL}/blog/category/skills</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${SITE_URL}/blog/category/age-groups</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${SITE_URL}/blog/category/performance</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${SITE_URL}/blog/category/culture</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${SITE_URL}/blog/category/wellness</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${SITE_URL}/blog/category/music</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Individual Blog Posts -->
${posts.map(post => {
  const lastmod = post.updatedAt ? new Date(post.updatedAt).toISOString().split('T')[0] : CURRENT_DATE;
  return `  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
}).join('\n')}

</urlset>`;

  return sitemap;
}

function updateHumansTxt() {
  console.log('👥 Updating humans.txt...');
  
  const humansTxt = `/* TEAM */
    Developer: Team Stay Afloat
    Contact: sway@tuta.io
    From: Dance Community

/* SITE */
    Last update: ${CURRENT_DATE}
    Language: English
    Doctype: HTML5
    IDE: Cursor
    Standards: HTML5, CSS3, JavaScript
    Components: Next.js, React, AWS DynamoDB, Supabase
    Software: Node.js, npm

/* THANKS */
    Dance Community: For inspiration and feedback
    OpenAI: For AI-powered content generation
    AWS: For reliable infrastructure
    Supabase: For authentication services

/* MISSION */
    To inspire and educate dancers of all levels through 
    character-driven content, AI-powered insights, and 
    a supportive community focused on movement and growth.

/* CHARACTERS */
    Luna: The encouraging cheerleader
    Marcus: The smooth mentor
    Alex: The confident showman
    Zara: The edgy rebel
    Kai: The mysterious guide
    Jordan: The energetic big brother
    Rio & Maya: The dynamic DJ duo`;

  return humansTxt;
}

function updateSecurityTxt() {
  console.log('🔒 Updating security.txt...');
  
  const nextYear = new Date().getFullYear() + 1;
  const securityTxt = `# Security Policy for Sway Quest
# Last updated: ${CURRENT_DATE}

Contact: mailto:security@swayquest.com
Expires: ${nextYear}-01-01T00:00:00.000Z
Preferred-Languages: en
Canonical: ${SITE_URL}/.well-known/security.txt
Policy: ${SITE_URL}/security-policy

# Security researchers are welcome to report vulnerabilities
# We appreciate responsible disclosure and will respond within 48 hours
# For urgent security issues, please use the email above`;

  return securityTxt;
}

async function writeFiles(sitemapXML, humansTxt, securityTxt) {
  try {
    // Write sitemap.xml
    fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemapXML);
    console.log('✅ sitemap.xml updated');

    // Write humans.txt
    fs.writeFileSync(path.join(process.cwd(), 'public', 'humans.txt'), humansTxt);
    console.log('✅ humans.txt updated');

    // Write security.txt (both locations)
    fs.writeFileSync(path.join(process.cwd(), 'public', 'security.txt'), securityTxt);
    fs.writeFileSync(path.join(process.cwd(), 'public', '.well-known', 'security.txt'), securityTxt);
    console.log('✅ security.txt updated (both locations)');

    return true;
  } catch (error) {
    console.error('❌ Error writing files:', error);
    return false;
  }
}

function generateSEOReport(posts) {
  console.log('\n📈 SEO Report:');
  console.log('=' .repeat(50));
  
  // Post count by category
  const categoryCounts = {};
  posts.forEach(post => {
    const category = post.category || 'uncategorized';
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  console.log('📊 Posts by Category:');
  Object.entries(categoryCounts).forEach(([category, count]) => {
    console.log(`   ${category}: ${count} posts`);
  });

  // Recent posts
  const recentPosts = posts
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  console.log('\n🆕 Recent Posts:');
  recentPosts.forEach(post => {
    const date = new Date(post.updatedAt).toLocaleDateString();
    console.log(`   ${date}: ${post.title} (${post.slug})`);
  });

  // Tag analysis
  const allTags = posts.flatMap(post => post.tags || []);
  const tagCounts = {};
  allTags.forEach(tag => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  });

  const topTags = Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  console.log('\n🏷️  Top Tags:');
  topTags.forEach(([tag, count]) => {
    console.log(`   ${tag}: ${count} posts`);
  });

  console.log('\n✅ SEO files updated successfully!');
  console.log(`📝 Total posts in sitemap: ${posts.length}`);
  console.log(`🌐 Sitemap URL: ${SITE_URL}/sitemap.xml`);
  console.log(`🤖 LLM files: ${SITE_URL}/llms.txt, ${SITE_URL}/llms-full.txt`);
}

async function main() {
  console.log('🚀 Starting SEO Files Update...\n');

  // Check environment variables
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error('❌ AWS credentials not found. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY');
    process.exit(1);
  }

  // Get all blog posts
  const posts = await getAllBlogPosts();
  
  if (posts.length === 0) {
    console.log('⚠️  No posts found. Creating basic sitemap...');
  }

  // Generate updated files
  const sitemapXML = generateSitemapXML(posts);
  const humansTxt = updateHumansTxt();
  const securityTxt = updateSecurityTxt();

  // Write files
  const success = await writeFiles(sitemapXML, humansTxt, securityTxt);

  if (success) {
    generateSEOReport(posts);
  } else {
    console.error('❌ Failed to update SEO files');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  getAllBlogPosts,
  generateSitemapXML,
  updateHumansTxt,
  updateSecurityTxt,
  writeFiles,
  generateSEOReport
};
