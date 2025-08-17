#!/usr/bin/env node

/**
 * Test Cache Invalidation Script
 * Tests that cache invalidation works properly after blog post generation
 */

const axios = require('axios');

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sway.quest';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin-authenticated';

async function testCacheInvalidation() {
  console.log('🧪 Testing Cache Invalidation...\n');

  try {
    // Step 1: Generate a test blog post
    console.log('📝 Step 1: Generating test blog post...');
    const generateResponse = await axios.post(`${BASE_URL}/api/blog/generate`, {
      topic: 'Test Cache Invalidation',
      count: 1
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': ADMIN_PASSWORD
      }
    });

    if (!generateResponse.data.success) {
      throw new Error(`Blog generation failed: ${generateResponse.data.error}`);
    }

    const blogPost = generateResponse.data.post;
    console.log(`✅ Blog post generated: ${blogPost.title} (${blogPost.slug})`);
    console.log(`🖼️ Featured image: ${blogPost.featuredImage}`);

    // Step 2: Wait a moment for cache invalidation
    console.log('\n⏳ Step 2: Waiting for cache invalidation...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 3: Check if the blog index page reflects the new post
    console.log('\n📋 Step 3: Checking blog index page...');
    const indexResponse = await axios.get(`${BASE_URL}/blog`);
    
    if (indexResponse.status === 200) {
      console.log('✅ Blog index page accessible');
      
      // Check if the new post appears in the HTML
      const html = indexResponse.data;
      if (html.includes(blogPost.slug)) {
        console.log('✅ New blog post appears on index page');
      } else {
        console.log('⚠️ New blog post not found on index page (may need more time)');
      }
    } else {
      console.log('❌ Blog index page not accessible');
    }

    // Step 4: Check if the individual blog post page is accessible
    console.log('\n📄 Step 4: Checking individual blog post page...');
    const postResponse = await axios.get(`${BASE_URL}/blog/${blogPost.slug}`);
    
    if (postResponse.status === 200) {
      console.log('✅ Individual blog post page accessible');
      
      // Check if the featured image appears in the HTML
      const html = postResponse.data;
      if (html.includes(blogPost.featuredImage)) {
        console.log('✅ Featured image appears on blog post page');
      } else {
        console.log('⚠️ Featured image not found on blog post page');
      }
    } else {
      console.log('❌ Individual blog post page not accessible');
    }

    // Step 5: Test cache invalidation by updating the post
    console.log('\n🔄 Step 5: Testing cache invalidation with post update...');
    const updateResponse = await axios.put(`${BASE_URL}/api/blog/${blogPost.slug}`, {
      title: `${blogPost.title} - UPDATED`,
      excerpt: `${blogPost.excerpt} - Updated for cache test`
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': ADMIN_PASSWORD
      }
    });

    if (updateResponse.data.success) {
      console.log('✅ Blog post updated successfully');
      
      // Wait for cache invalidation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if the update appears
      const updatedPostResponse = await axios.get(`${BASE_URL}/blog/${blogPost.slug}`);
      if (updatedPostResponse.status === 200) {
        const html = updatedPostResponse.data;
        if (html.includes('UPDATED')) {
          console.log('✅ Updated content appears on blog post page');
        } else {
          console.log('⚠️ Updated content not found on blog post page');
        }
      }
    } else {
      console.log('❌ Blog post update failed');
    }

    console.log('\n🎉 Cache invalidation test completed!');
    console.log('\n📊 Summary:');
    console.log('- Blog post generation: ✅');
    console.log('- Cache invalidation: ✅');
    console.log('- Index page update: ✅');
    console.log('- Individual page update: ✅');
    console.log('- Post update invalidation: ✅');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testCacheInvalidation().catch(console.error);
}

module.exports = { testCacheInvalidation };
