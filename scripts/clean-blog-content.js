#!/usr/bin/env node

/**
 * Script to clean existing blog posts by removing SEO text from content
 * This removes "Meta Description: " and similar text from the content field
 * while preserving the meta description in the seoDescription field
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// AWS Configuration
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const dynamoDocClient = DynamoDBDocumentClient.from(client);
const BLOG_POSTS_TABLE = process.env.AWS_DYNAMODB_BLOG || 'sway-blog-posts';

// Clean content by removing SEO-related text that shouldn't be visible
function cleanContent(content) {
  if (!content) return content;
  
  let cleanedContent = content;
  
  // Remove "Meta Description: " lines and similar SEO text
  cleanedContent = cleanedContent.replace(/^Meta Description:\s*.+$/gm, '');
  cleanedContent = cleanedContent.replace(/^SEO Title:\s*.+$/gm, '');
  cleanedContent = cleanedContent.replace(/^Tags:\s*.+$/gm, '');
  cleanedContent = cleanedContent.replace(/^Category:\s*.+$/gm, '');
  cleanedContent = cleanedContent.replace(/^Meta:\s*.+$/gm, '');
  
  // Remove empty lines that might be left after cleaning
  cleanedContent = cleanedContent.replace(/\n\s*\n\s*\n/g, '\n\n');
  cleanedContent = cleanedContent.trim();
  
  return cleanedContent;
}

// Extract meta description from content before cleaning
function extractMetaDescription(content) {
  if (!content) return null;
  
  const metaMatch = content.match(/Meta Description:\s*(.+)/i);
  if (metaMatch) {
    return metaMatch[1].trim();
  }
  
  return null;
}

async function cleanBlogPosts() {
  try {
    console.log('🔍 Scanning blog posts for content that needs cleaning...');
    
    // Scan all blog posts
    const scanCommand = new ScanCommand({
      TableName: BLOG_POSTS_TABLE,
      FilterExpression: 'begins_with(pk, :pkPrefix)',
      ExpressionAttributeValues: {
        ':pkPrefix': 'BLOG#',
      },
    });

    const response = await dynamoDocClient.send(scanCommand);
    const posts = response.Items || [];
    
    console.log(`📝 Found ${posts.length} blog posts to check`);
    
    let cleanedCount = 0;
    let updatedCount = 0;
    
    for (const post of posts) {
      if (!post.content) continue;
      
      const originalContent = post.content;
      const cleanedContent = cleanContent(originalContent);
      const extractedMetaDescription = extractMetaDescription(originalContent);
      
      // Check if content needs cleaning
      if (cleanedContent !== originalContent) {
        cleanedCount++;
        console.log(`🧹 Cleaning content for post: ${post.title || post.slug}`);
        
        const updates = {
          content: cleanedContent,
          updatedAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
        };
        
        // If we extracted a meta description and don't have one, add it
        if (extractedMetaDescription && !post.seoDescription) {
          updates.seoDescription = extractedMetaDescription;
          console.log(`  📋 Added meta description: ${extractedMetaDescription.substring(0, 50)}...`);
        }
        
        // Update the post
        const updateCommand = new UpdateCommand({
          TableName: BLOG_POSTS_TABLE,
          Key: { 
            pk: post.pk,
            createdAt: post.createdAt 
          },
          UpdateExpression: `SET ${Object.keys(updates).map(key => `#${key} = :${key}`).join(', ')}`,
          ExpressionAttributeNames: Object.fromEntries(
            Object.keys(updates).map(key => [`#${key}`, key])
          ),
          ExpressionAttributeValues: Object.fromEntries(
            Object.entries(updates).map(([key, value]) => [`:${key}`, value])
          ),
        });
        
        await dynamoDocClient.send(updateCommand);
        updatedCount++;
        
        console.log(`  ✅ Updated post: ${post.title || post.slug}`);
      }
    }
    
    console.log(`\n🎉 Cleaning complete!`);
    console.log(`📊 Summary:`);
    console.log(`  - Posts checked: ${posts.length}`);
    console.log(`  - Posts cleaned: ${cleanedCount}`);
    console.log(`  - Posts updated: ${updatedCount}`);
    
    if (cleanedCount === 0) {
      console.log(`✨ All posts are already clean!`);
    }
    
  } catch (error) {
    console.error('❌ Error cleaning blog posts:', error);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  cleanBlogPosts();
}
