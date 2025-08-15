const axios = require('axios');

// Test blog post generation
async function testBlogGeneration() {
  try {
    console.log('🚀 Testing blog post generation...');
    
    // Test 1: Generate with preset topic
    console.log('\n📝 Test 1: Generate with preset topic');
    const response1 = await axios.post('http://localhost:3000/api/blog/generate', {
      topic: 'How to Improve Your Dance Rhythm and Timing',
      count: 1
    });
    
    if (response1.data.success) {
      console.log('✅ Success!');
      console.log(`📄 Title: ${response1.data.post.title}`);
      console.log(`🔗 Slug: ${response1.data.post.slug}`);
      console.log(`📊 Read Time: ${response1.data.post.readTime} minutes`);
      console.log(`🏷️ Category: ${response1.data.post.category}`);
      console.log(`🏷️ Tags: ${response1.data.post.tags.join(', ')}`);
      console.log(`🖼️ OG Image: ${response1.data.post.ogImage}`);
      console.log(`📖 FAQ Schema: ${response1.data.post.faqSchema ? 'Generated' : 'None'}`);
    } else {
      console.log('❌ Failed:', response1.data.error);
    }

    // Test 2: Generate with custom topic
    console.log('\n📝 Test 2: Generate with custom topic');
    const response2 = await axios.post('http://localhost:3000/api/blog/generate', {
      topic: 'Advanced Dance Techniques for Professional Performers',
      count: 1
    });
    
    if (response2.data.success) {
      console.log('✅ Success!');
      console.log(`📄 Title: ${response2.data.post.title}`);
      console.log(`🔗 Slug: ${response2.data.post.slug}`);
      console.log(`📊 Read Time: ${response2.data.post.readTime} minutes`);
    } else {
      console.log('❌ Failed:', response2.data.error);
    }

    // Test 3: Generate multiple posts
    console.log('\n📝 Test 3: Generate multiple posts');
    const response3 = await axios.post('http://localhost:3000/api/blog/generate', {
      count: 2
    });
    
    if (response3.data.success) {
      console.log('✅ Success!');
      console.log(`📊 Summary: ${response3.data.summary.successful}/${response3.data.summary.total} successful`);
      response3.data.results.forEach((result, index) => {
        if (result.success) {
          console.log(`  ${index + 1}. ${result.post.title}`);
        } else {
          console.log(`  ${index + 1}. ❌ ${result.error}`);
        }
      });
    } else {
      console.log('❌ Failed:', response3.data.error);
    }

    // Test 4: Get available topics
    console.log('\n📝 Test 4: Get available topics');
    const response4 = await axios.get('http://localhost:3000/api/blog/generate');
    
    if (response4.data.success) {
      console.log('✅ Success!');
      console.log(`📚 Available topics: ${response4.data.topics.length}`);
      console.log(`🏷️ Categories: ${response4.data.categories.join(', ')}`);
      console.log(`🏷️ Tags: ${response4.data.tags.slice(0, 10).join(', ')}...`);
    } else {
      console.log('❌ Failed:', response4.data.error);
    }

    console.log('\n🎉 All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure your development server is running: npm run dev');
    }
  }
}

// Run the test
if (require.main === module) {
  testBlogGeneration();
}

module.exports = { testBlogGeneration };
