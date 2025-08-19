#!/usr/bin/env node

/**
 * Test script to verify APP_BLOG_GEN_IMAGE environment variable functionality
 * 
 * This script tests both scenarios:
 * 1. APP_BLOG_GEN_IMAGE=false - should skip image generation
 * 2. APP_BLOG_GEN_IMAGE not set or true - should generate images
 */

import dotenv from 'dotenv';
import { blogService } from '../src/lib/blogService.js';

// Load environment variables
dotenv.config();

async function testBlogGenerationWithImageEnv() {
  console.log('🧪 Testing APP_BLOG_GEN_IMAGE environment variable functionality...\n');

  // Test 1: With APP_BLOG_GEN_IMAGE=false
  console.log('📋 Test 1: APP_BLOG_GEN_IMAGE=false');
  process.env.APP_BLOG_GEN_IMAGE = 'false';
  
  try {
    const response = await fetch('http://localhost:3000/api/blog/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': 'admin-authenticated'
      },
      body: JSON.stringify({
        topic: 'Test Dance Moves',
        count: 1
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Blog post generated successfully with APP_BLOG_GEN_IMAGE=false');
      console.log(`📝 Title: ${result.post.title}`);
      console.log(`🖼️ Featured Image: ${result.post.featuredImage}`);
      
      // Check if image is OG image (fallback) instead of AI-generated
      if (result.post.featuredImage && result.post.featuredImage.includes('/api/og')) {
        console.log('✅ Correctly used OG image fallback (no AI image generated)');
      } else if (!result.post.featuredImage) {
        console.log('✅ No featured image set (as expected)');
      } else {
        console.log('⚠️ Unexpected: AI image was generated despite APP_BLOG_GEN_IMAGE=false');
      }
    } else {
      console.log('❌ Blog generation failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error testing with APP_BLOG_GEN_IMAGE=false:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: With APP_BLOG_GEN_IMAGE not set (should default to enabled)
  console.log('📋 Test 2: APP_BLOG_GEN_IMAGE not set (should enable image generation)');
  delete process.env.APP_BLOG_GEN_IMAGE;
  
  try {
    const response = await fetch('http://localhost:3000/api/blog/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': 'admin-authenticated'
      },
      body: JSON.stringify({
        topic: 'Another Test Dance Topic',
        count: 1
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Blog post generated successfully with APP_BLOG_GEN_IMAGE not set');
      console.log(`📝 Title: ${result.post.title}`);
      console.log(`🖼️ Featured Image: ${result.post.featuredImage}`);
      
      // Check if image was generated
      if (result.post.featuredImage && result.post.featuredImage.includes('s3.amazonaws.com')) {
        console.log('✅ AI image was generated (as expected)');
      } else if (result.post.featuredImage && result.post.featuredImage.includes('/api/og')) {
        console.log('⚠️ Used OG image fallback (AI generation may have failed)');
      } else {
        console.log('⚠️ No featured image set (unexpected)');
      }
    } else {
      console.log('❌ Blog generation failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error testing with APP_BLOG_GEN_IMAGE not set:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 3: Test image regeneration API with APP_BLOG_GEN_IMAGE=false
  console.log('📋 Test 3: Image regeneration API with APP_BLOG_GEN_IMAGE=false');
  process.env.APP_BLOG_GEN_IMAGE = 'false';
  
  try {
    // First, get a blog post to test with
    const posts = await blogService.getAllPosts();
    if (posts.length === 0) {
      console.log('⚠️ No blog posts found to test image regeneration');
      return;
    }

    const testPost = posts[0];
    console.log(`📝 Testing with post: ${testPost.title}`);

    const response = await fetch('http://localhost:3000/api/blog/regenerate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': 'admin-authenticated'
      },
      body: JSON.stringify({
        slug: testPost.slug,
        model: 'dall-e-3'
      })
    });

    const result = await response.json();
    
    if (response.status === 403) {
      console.log('✅ Image regeneration correctly blocked with APP_BLOG_GEN_IMAGE=false');
      console.log(`🚫 Error: ${result.error}`);
    } else if (result.success) {
      console.log('⚠️ Image regeneration succeeded despite APP_BLOG_GEN_IMAGE=false');
    } else {
      console.log('❌ Image regeneration failed for unexpected reason:', result.error);
    }
  } catch (error) {
    console.error('❌ Error testing image regeneration:', error.message);
  }

  console.log('\n🎉 Test completed!');
}

// Run the test
testBlogGenerationWithImageEnv().catch(console.error);
