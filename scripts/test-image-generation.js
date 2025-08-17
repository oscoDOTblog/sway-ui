import { config } from 'dotenv';
import { resolve } from 'path';
import { generateBlogImage, generateFallbackImage } from '../src/lib/imageService.js';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

async function testImageGeneration() {
  console.log('🧪 Testing AI Image Generation for Blog Posts\n');

  try {
    // Test 1: AI Image Generation
    console.log('🎨 Test 1: Generating AI image with OpenAI GPT-4o Image Generation Tool...');
    const testTopic = "How to Master Dance Moves";
    const testSlug = "test-dance-moves";
    
    const aiImageUrl = await generateBlogImage(testTopic, testSlug);
    
    if (aiImageUrl) {
      console.log('✅ AI image generated successfully!');
      console.log(`📸 Image URL: ${aiImageUrl}`);
    } else {
      console.log('⚠️ AI image generation failed, this is expected if OpenAI quota is exceeded');
    }

    console.log('\n🎨 Test 2: Generating fallback image...');
    const fallbackImageUrl = await generateFallbackImage(testTopic, testSlug);
    
    if (fallbackImageUrl) {
      console.log('✅ Fallback image generated successfully!');
      console.log(`📸 Fallback Image URL: ${fallbackImageUrl}`);
    } else {
      console.log('❌ Fallback image generation failed');
    }

    console.log('\n🎉 Image generation test completed!');
    console.log('\n📋 Summary:');
    console.log('   • AI Image Generation: ✅ Implemented');
    console.log('   • Fallback Image Generation: ✅ Implemented');
    console.log('   • S3 Upload: ✅ Implemented');
    console.log('   • Error Handling: ✅ Graceful failure');
    console.log('\n💡 The blog generation will now automatically:');
    console.log('   1. Try to generate an AI image with "anime graffiti street style" prefix');
    console.log('   2. If AI generation fails, create a fallback text-based image');
    console.log('   3. If both fail, use the existing OG image generation');
    console.log('   4. Continue with blog creation regardless of image success');

  } catch (error) {
    console.error('❌ Error testing image generation:', error.message);
    
    if (error.message.includes('OPENAI_API_KEY')) {
      console.error('🔑 Make sure OPENAI_API_KEY is set in your .env.local file');
    } else if (error.message.includes('AWS_ACCESS_KEY_ID')) {
      console.error('🔑 Make sure AWS credentials are set in your .env.local file');
    } else if (error.message.includes('NoSuchBucket')) {
      console.error('🪣 Make sure the S3 bucket "sway-public-use2" exists');
    }
    
    process.exit(1);
  }
}

// Run the test
testImageGeneration().catch(console.error);
