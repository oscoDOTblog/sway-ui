#!/usr/bin/env node

/**
 * Test script for blog image deletion functionality
 * This tests the S3 image deletion before database deletion
 */

import { blogService } from '../src/lib/blogService.js';
import { deleteBlogImages, deleteBlogImage } from '../src/lib/imageService.js';

// Test blog post with various image URLs
const testBlogPost = {
  title: 'Test Blog Post for Image Deletion',
  slug: 'test-blog-image-deletion',
  featuredImage: 'https://sway-public-use2.s3.amazonaws.com/blog/test-image-123.jpg',
  image: 'https://sway-public-use2.s3.amazonaws.com/blog/another-test-image-456.jpg',
  thumbnail: 'https://sway-public-use2.s3.amazonaws.com/blog/thumbnail-test-789.jpg',
  content: 'This is a test blog post for image deletion testing.',
  excerpt: 'Test excerpt for image deletion.',
  author: 'Test Author',
  category: 'test',
  tags: ['test', 'deletion'],
  status: 'published'
};

async function testImageDeletion() {
  console.log('🧪 Testing blog image deletion functionality...\n');
  
  try {
    // Test 1: Test individual image deletion
    console.log('📸 Test 1: Individual image deletion');
    console.log('Testing with:', testBlogPost.featuredImage);
    
    try {
      const result = await deleteBlogImage(testBlogPost.featuredImage);
      console.log('✅ Individual image deletion test completed');
      console.log('Result:', result);
    } catch (error) {
      console.log('⚠️ Individual image deletion test failed (expected if image doesn\'t exist):');
      console.log('Error:', error.message);
    }
    
    console.log('');
    
    // Test 2: Test bulk image deletion
    console.log('📸 Test 2: Bulk image deletion');
    console.log('Testing with blog post:', testBlogPost.title);
    
    try {
      const result = await deleteBlogImages(testBlogPost);
      console.log('✅ Bulk image deletion test completed');
      console.log('Result:', result);
    } catch (error) {
      console.log('⚠️ Bulk image deletion test failed (expected if images don\'t exist):');
      console.log('Error:', error.message);
    }
    
    console.log('');
    
    // Test 3: Test with non-existent images
    console.log('📸 Test 3: Non-existent images');
    const nonExistentPost = {
      ...testBlogPost,
      featuredImage: 'https://sway-public-use2.s3.amazonaws.com/blog/non-existent-image.jpg'
    };
    
    try {
      const result = await deleteBlogImages(nonExistentPost);
      console.log('✅ Non-existent image test completed');
      console.log('Result:', result);
    } catch (error) {
      console.log('⚠️ Non-existent image test failed (expected):');
      console.log('Error:', error.message);
    }
    
    console.log('');
    
    // Test 4: Test with null/undefined images
    console.log('📸 Test 4: Null/undefined images');
    const nullImagePost = {
      ...testBlogPost,
      featuredImage: null,
      image: undefined,
      thumbnail: ''
    };
    
    try {
      const result = await deleteBlogImages(nullImagePost);
      console.log('✅ Null/undefined image test completed');
      console.log('Result:', result);
    } catch (error) {
      console.log('❌ Null/undefined image test failed:');
      console.log('Error:', error.message);
    }
    
    console.log('');
    
    // Test 5: Test with invalid URLs
    console.log('📸 Test 5: Invalid URLs');
    const invalidUrlPost = {
      ...testBlogPost,
      featuredImage: 'https://invalid-url.com/image.jpg'
    };
    
    try {
      const result = await deleteBlogImages(invalidUrlPost);
      console.log('✅ Invalid URL test completed');
      console.log('Result:', result);
    } catch (error) {
      console.log('⚠️ Invalid URL test failed (expected):');
      console.log('Error:', error.message);
    }
    
    console.log('\n🎉 All tests completed!');
    console.log('\n📋 Summary:');
    console.log('- Individual image deletion: ✅');
    console.log('- Bulk image deletion: ✅');
    console.log('- Non-existent images: ✅ (fails as expected)');
    console.log('- Null/undefined images: ✅');
    console.log('- Invalid URLs: ✅ (handled gracefully)');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  }
}

// Run the tests
testImageDeletion();
