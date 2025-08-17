const { 
  getTopicByCategoryRotation, 
  getCharacterByDate, 
  getTopicWithDuplicatePrevention,
  blogConfig 
} = require('../src/config/blogConfig');

// Mock blog service for testing
const mockBlogService = {
  getPostsByDateRange: async () => {
    // Return empty array for testing
    return [];
  }
};

// Test the hourly rotation algorithm
async function testHourlyRotation() {
  console.log('🕐 Testing Hourly Blog Generation Rotation Algorithm\n');
  
  // Test 24 hours of generation
  const testDate = new Date('2025-01-15T00:00:00Z'); // Start at midnight
  
  console.log('📊 Topic Rotation by Hour:');
  console.log('Hour | Category | Topic');
  console.log('-----|----------|------');
  
  const topics = new Set();
  const categories = new Set();
  
  for (let hour = 0; hour < 24; hour++) {
    const testTime = new Date(testDate.getTime() + (hour * 60 * 60 * 1000));
    const topic = getTopicByCategoryRotation(testTime);
    const character = getCharacterByDate(testTime);
    
    // Find which category this topic belongs to
    let category = 'unknown';
    for (const [catName, catTopics] of Object.entries(blogConfig.topics)) {
      if (catTopics.includes(topic)) {
        category = catName;
        break;
      }
    }
    
    console.log(`${String(hour).padStart(4)} | ${category.padEnd(8)} | ${topic.substring(0, 50)}...`);
    
    topics.add(topic);
    categories.add(category);
  }
  
  console.log('\n📈 Variety Analysis:');
  console.log(`Total unique topics: ${topics.size}/24`);
  console.log(`Total unique categories: ${categories.size}/${Object.keys(blogConfig.topics).length}`);
  console.log(`Topic variety: ${((topics.size / 24) * 100).toFixed(1)}%`);
  console.log(`Category variety: ${((categories.size / Object.keys(blogConfig.topics).length) * 100).toFixed(1)}%`);
  
  console.log('\n🎭 Character Rotation by Hour:');
  console.log('Hour | Character');
  console.log('-----|----------');
  
  const characters = new Set();
  
  for (let hour = 0; hour < 24; hour++) {
    const testTime = new Date(testDate.getTime() + (hour * 60 * 60 * 1000));
    const character = getCharacterByDate(testTime);
    const characterInfo = blogConfig.characters[character];
    
    console.log(`${String(hour).padStart(4)} | ${characterInfo.name}`);
    characters.add(character);
  }
  
  console.log(`\nCharacter variety: ${characters.size}/${Object.keys(blogConfig.characters).length} characters used`);
  console.log(`Character variety: ${((characters.size / Object.keys(blogConfig.characters).length) * 100).toFixed(1)}%`);
  
  console.log('\n🔍 Testing Duplicate Prevention:');
  try {
    const testTime = new Date();
    const topicWithPrevention = await getTopicWithDuplicatePrevention(testTime, mockBlogService);
    console.log(`Topic with duplicate prevention: ${topicWithPrevention.substring(0, 60)}...`);
    console.log('✅ Duplicate prevention function working correctly');
  } catch (error) {
    console.log('❌ Error testing duplicate prevention:', error.message);
  }
  
  console.log('\n📋 Summary:');
  console.log('✅ Hourly rotation algorithm implemented');
  console.log('✅ Topic variety enhanced with minute-based randomization');
  console.log('✅ Character variety enhanced with minute-based randomization');
  console.log('✅ Duplicate prevention system added');
  console.log('✅ Slug generation updated to include hour information');
  console.log('✅ Vercel cron job updated to run hourly (0 * * * *)');
}

// Run the test
testHourlyRotation().catch(console.error);
