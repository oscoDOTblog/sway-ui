const { 
  blogConfig, 
  getAllTopics, 
  getRandomTopic, 
  getTopicByDate, 
  getTopicByCategory, 
  getRandomTopicFromCategory, 
  getTopicByCategoryRotation, 
  getCategoryNames 
} = require('../src/config/blogConfig');

// Test the categorized topic system
function testCategorizedTopics() {
  console.log('📝 Testing Categorized Topic System\n');
  console.log('=' .repeat(50));

  // Test category names
  console.log('🏷️  Category Names:');
  const categories = getCategoryNames();
  console.log(`Found ${categories.length} categories:\n`);
  categories.forEach((category, index) => {
    console.log(`${index + 1}. ${category}`);
  });
  console.log('');

  // Test getting all topics
  console.log('📋 All Topics:');
  const allTopics = getAllTopics();
  console.log(`Total topics: ${allTopics.length}\n`);
  
  // Show first 5 topics as sample
  allTopics.slice(0, 5).forEach((topic, index) => {
    console.log(`${index + 1}. ${topic}`);
  });
  console.log('...\n');

  // Test category-specific topics
  console.log('📂 Topics by Category:');
  categories.forEach(category => {
    const categoryTopics = getTopicByCategory(category);
    console.log(`${category}: ${categoryTopics.length} topics`);
  });
  console.log('');

  // Test random topic selection
  console.log('🎲 Random Topic Selection:');
  for (let i = 0; i < 5; i++) {
    const randomTopic = getRandomTopic();
    console.log(`${i + 1}. ${randomTopic}`);
  }
  console.log('');

  // Test category-based random selection
  console.log('🎯 Random Topics by Category:');
  categories.slice(0, 3).forEach(category => {
    const randomTopic = getRandomTopicFromCategory(category);
    console.log(`${category}: ${randomTopic}`);
  });
  console.log('');

  // Test date-based selection
  console.log('📅 Date-Based Topic Selection:');
  const testDates = [
    new Date('2024-01-01'),
    new Date('2024-02-15'),
    new Date('2024-06-30'),
    new Date('2024-12-31')
  ];

  testDates.forEach(date => {
    const topic = getTopicByDate(date);
    console.log(`${date.toDateString()}: ${topic}`);
  });
  console.log('');

  // Test category rotation
  console.log('🔄 Category Rotation (Daily):');
  for (let i = 0; i < 10; i++) {
    const testDate = new Date('2024-01-01');
    testDate.setDate(testDate.getDate() + i);
    const topic = getTopicByCategoryRotation(testDate);
    console.log(`Day ${i + 1}: ${topic}`);
  }
  console.log('');

  // Test topic distribution
  console.log('📊 Topic Distribution Analysis:');
  const topicCounts = {};
  categories.forEach(category => {
    const categoryTopics = getTopicByCategory(category);
    topicCounts[category] = categoryTopics.length;
  });

  Object.entries(topicCounts).forEach(([category, count]) => {
    console.log(`${category}: ${count} topics`);
  });

  const totalTopics = Object.values(topicCounts).reduce((sum, count) => sum + count, 0);
  console.log(`\nTotal topics across all categories: ${totalTopics}`);
  console.log('');

  // Test topic quality (check for SEO-friendly titles)
  console.log('🔍 SEO Title Quality Check:');
  const seoKeywords = [
    'learn', 'how to', 'beginner', 'tutorial', 'guide', 'tips', 'best', 'top', 'complete'
  ];
  
  let seoOptimizedCount = 0;
  allTopics.forEach(topic => {
    const hasSeoKeyword = seoKeywords.some(keyword => 
      topic.toLowerCase().includes(keyword)
    );
    if (hasSeoKeyword) seoOptimizedCount++;
  });

  const seoPercentage = ((seoOptimizedCount / allTopics.length) * 100).toFixed(1);
  console.log(`SEO-optimized titles: ${seoOptimizedCount}/${allTopics.length} (${seoPercentage}%)`);
  console.log('');

  // Test category balance
  console.log('⚖️  Category Balance:');
  const avgTopicsPerCategory = (totalTopics / categories.length).toFixed(1);
  console.log(`Average topics per category: ${avgTopicsPerCategory}`);
  
  const minTopics = Math.min(...Object.values(topicCounts));
  const maxTopics = Math.max(...Object.values(topicCounts));
  console.log(`Topics range: ${minTopics} - ${maxTopics} per category`);
  console.log('');

  console.log('✅ Categorized topic system test completed!');
}

// Test API compatibility
function testApiCompatibility() {
  console.log('\n🔌 API Compatibility Test\n');
  console.log('=' .repeat(50));

  // Test that the old functions still work
  console.log('Testing backward compatibility...');
  
  try {
    const randomTopic = getRandomTopic();
    console.log(`✅ getRandomTopic(): ${randomTopic}`);
    
    const dateTopic = getTopicByDate();
    console.log(`✅ getTopicByDate(): ${dateTopic}`);
    
    const categories = getCategoryNames();
    console.log(`✅ getCategoryNames(): ${categories.length} categories`);
    
    console.log('\n✅ All API functions working correctly!');
  } catch (error) {
    console.log(`❌ API compatibility error: ${error.message}`);
  }
}

// Test topic generation scenarios
function testGenerationScenarios() {
  console.log('\n🎬 Generation Scenarios Test\n');
  console.log('=' .repeat(50));

  const scenarios = [
    { name: 'Random topic, random character', topic: null, character: null, category: null },
    { name: 'Specific category, random character', topic: null, character: null, category: 'fitness' },
    { name: 'Specific topic, specific character', topic: 'Hip Hop Dance Basics for Beginners', character: 'dare', category: null },
    { name: 'Category + character', topic: null, character: 'emilia', category: 'homeLearning' },
  ];

  scenarios.forEach((scenario, index) => {
    console.log(`\n${index + 1}. ${scenario.name}:`);
    
    let topic = scenario.topic;
    if (!topic && scenario.category) {
      topic = getRandomTopicFromCategory(scenario.category);
    }
    if (!topic) {
      topic = getRandomTopic();
    }
    
    console.log(`   Topic: ${topic}`);
    console.log(`   Character: ${scenario.character || 'Random'}`);
    console.log(`   Category: ${scenario.category || 'Any'}`);
  });

  console.log('\n✅ All generation scenarios tested!');
}

// Run all tests
function runAllTests() {
  console.log('🚀 Starting Categorized Topic System Tests\n');
  
  testCategorizedTopics();
  testApiCompatibility();
  testGenerationScenarios();
  
  console.log('\n' + '=' .repeat(50));
  console.log('🎉 All tests completed successfully!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testCategorizedTopics,
  testApiCompatibility,
  testGenerationScenarios,
  runAllTests
};
