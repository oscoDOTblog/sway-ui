#!/usr/bin/env node

import { config } from 'dotenv';
import { resolve } from 'path';
import { generateBlogImage, generateFallbackImage } from '../src/lib/imageService.js';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

async function testBlogTimeout() {
  console.log('⏱️ Testing Blog Generation Timeout Handling\n');

  const startTime = Date.now();
  
  try {
    console.log('🎨 Test 1: AI Image Generation with timeout...');
    const testTopic = "How to Master Dance Moves";
    const testSlug = "test-timeout-dance-moves";
    
    const aiImageUrl = await generateBlogImage(testTopic, testSlug);
    
    const aiTime = Date.now() - startTime;
    console.log(`⏱️ AI image generation took: ${aiTime}ms`);
    
    if (aiImageUrl) {
      console.log('✅ AI image generated successfully!');
      console.log(`📸 Image URL: ${aiImageUrl}`);
    } else {
      console.log('⚠️ AI image generation failed or timed out - this is expected behavior');
    }

    console.log('\n🎨 Test 2: Fallback image generation...');
    const fallbackStartTime = Date.now();
    const fallbackImageUrl = await generateFallbackImage(testTopic, testSlug);
    const fallbackTime = Date.now() - fallbackStartTime;
    
    console.log(`⏱️ Fallback image generation took: ${fallbackTime}ms`);
    
    if (fallbackImageUrl) {
      console.log('✅ Fallback image generated successfully!');
      console.log(`📸 Fallback Image URL: ${fallbackImageUrl}`);
    } else {
      console.log('❌ Fallback image generation failed');
    }

    const totalTime = Date.now() - startTime;
    console.log(`\n⏱️ Total execution time: ${totalTime}ms`);
    
    console.log('\n📋 Vercel Pro Compatibility Analysis:');
    console.log('   • Vercel Pro API timeout: 10 seconds (10,000ms)');
    console.log('   • Vercel Pro Function timeout: 60 seconds (60,000ms)');
    console.log(`   • Current total time: ${totalTime}ms`);
    
    if (totalTime < 10000) {
      console.log('✅ ✅ ✅ COMPATIBLE with Vercel Pro API tier!');
    } else if (totalTime < 60000) {
      console.log('⚠️ ⚠️ ⚠️ May timeout on API tier, but works with function timeout');
      console.log('💡 Recommendation: Use function timeout configuration');
    } else {
      console.log('❌ ❌ ❌ May timeout even with function timeout');
      console.log('💡 Recommendation: Consider async processing or optimization');
    }

    console.log('\n🎉 Timeout test completed!');
    console.log('\n💡 Key Features:');
    console.log('   • 30-second timeout on AI image generation');
    console.log('   • Graceful fallback to text-based images');
    console.log('   • Non-blocking error handling');
    console.log('   • Blog posts created even if images fail');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testBlogTimeout().catch(console.error);
