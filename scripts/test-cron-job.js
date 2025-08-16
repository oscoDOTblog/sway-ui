#!/usr/bin/env node

// Script to test the cron job functionality
import fetch from 'node-fetch';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sway.quest';

async function testCronJob() {
  console.log('🧪 Testing Cron Job Functionality\n');
  
  try {
    console.log('📡 Making request to /api/blog/generate...');
    
    const response = await fetch(`${SITE_URL}/api/blog/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-vercel-cron': '1' // This simulates the cron job header
      },
      body: JSON.stringify({}) // Empty body for automated generation
    });
    
    const result = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📋 Response:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('\n✅ Cron job test successful!');
      console.log(`📝 Generated post: "${result.post?.title}"`);
      console.log(`🔗 Slug: ${result.post?.slug}`);
      console.log(`👤 Character: ${result.post?.author}`);
    } else {
      console.log('\n❌ Cron job test failed:');
      console.log(`Error: ${result.error}`);
    }
    
  } catch (error) {
    console.error('❌ Error testing cron job:', error.message);
  }
}

// Only run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testCronJob();
}

export default testCronJob;
