#!/usr/bin/env node

// Test blog generation with Telegram notifications
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

async function testBlogGeneration() {
  console.log('🧪 Testing Blog Generation with Telegram Notifications\n');

  try {
    console.log('📡 Making request to /api/blog/generate...');
    
    const response = await fetch('http://localhost:3000/api/blog/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': 'admin-authenticated',
      },
      body: JSON.stringify({
        topic: "Test Blog Post: How to Master Dance Moves",
        count: 1,
        character: "luna"
      })
    });
    
    const result = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📋 Response:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('\n✅ Blog generation test successful!');
      console.log(`📝 Generated post: "${result.post?.title}"`);
      console.log(`🔗 Slug: ${result.post?.slug}`);
      console.log(`👤 Character: ${result.post?.author}`);
      console.log('\n📱 Check your Telegram for the notification!');
    } else {
      console.log('\n❌ Blog generation test failed:');
      console.log(`Error: ${result.error}`);
    }
    
  } catch (error) {
    console.error('❌ Error testing blog generation:', error.message);
    console.log('\n💡 Make sure your Next.js development server is running on localhost:3000');
  }
}

// Run the test
testBlogGeneration().catch(error => {
  console.error('❌ Test failed with error:', error);
});
