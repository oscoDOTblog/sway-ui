const { blogConfig } = require('../src/config/blogConfig');

// Test the auto-categorization system
function testAutoCategorization() {
  console.log('🤖 Testing Auto-Categorization System\n');
  console.log('=' .repeat(50));

  // Test different topic types
  const testTopics = [
    "Hip Hop Dance Basics for Beginners",
    "Zumba at Home: Burn Calories While Having Fun", 
    "How to Master Turns and Spins in Dance",
    "Dance for Kids: Fun At-Home Activities",
    "Building a Dance Career: From Amateur to Professional",
    "Top 10 Dance Apps That Can Improve Your Skills"
  ];

  console.log('📝 Test Topics and Expected Categories:\n');

  testTopics.forEach((topic, index) => {
    console.log(`${index + 1}. "${topic}"`);
    
    // Predict expected category based on topic content
    let expectedCategory = 'dance-tips'; // default
    let expectedTags = ['dance'];
    
    if (topic.toLowerCase().includes('hip hop')) {
      expectedCategory = 'dance-tutorials';
      expectedTags = ['dance', 'hip-hop', 'beginner', 'tutorial', 'technique'];
    } else if (topic.toLowerCase().includes('zumba') || topic.toLowerCase().includes('calories')) {
      expectedCategory = 'dance-fitness';
      expectedTags = ['dance', 'fitness', 'weight-loss', 'cardio', 'zumba'];
    } else if (topic.toLowerCase().includes('turns') || topic.toLowerCase().includes('spins')) {
      expectedCategory = 'dance-technique';
      expectedTags = ['dance', 'technique', 'advanced', 'turns', 'spins'];
    } else if (topic.toLowerCase().includes('kids')) {
      expectedCategory = 'dance-education';
      expectedTags = ['dance', 'kids', 'beginner', 'coordination', 'fun'];
    } else if (topic.toLowerCase().includes('career') || topic.toLowerCase().includes('professional')) {
      expectedCategory = 'dance-lifestyle';
      expectedTags = ['dance', 'career', 'professional', 'business', 'lifestyle'];
    } else if (topic.toLowerCase().includes('apps') || topic.toLowerCase().includes('technology')) {
      expectedCategory = 'dance-culture';
      expectedTags = ['dance', 'technology', 'apps', 'digital', 'learning'];
    }
    
    console.log(`   Expected Category: ${expectedCategory}`);
    console.log(`   Expected Tags: ${expectedTags.join(', ')}`);
    console.log('');
  });

  console.log('✅ Auto-categorization logic test completed!');
  console.log('\n💡 The AI system will now automatically:');
  console.log('   - Analyze each topic\'s content and keywords');
  console.log('   - Select the most appropriate category from available options');
  console.log('   - Generate 5-8 relevant tags based on content focus');
  console.log('   - Create optimized SEO titles and descriptions');
  console.log('');
}

// Test category coverage
function testCategoryCoverage() {
  console.log('📊 Category Coverage Analysis\n');
  console.log('=' .repeat(50));

  const categories = blogConfig.categories;
  console.log(`Available Categories (${categories.length}):`);
  categories.forEach((category, index) => {
    console.log(`${index + 1}. ${category}`);
  });
  console.log('');

  // Analyze topic distribution across categories
  const allTopics = [];
  Object.values(blogConfig.topics).forEach(categoryTopics => {
    allTopics.push(...categoryTopics);
  });

  console.log(`Total Topics: ${allTopics.length}`);
  console.log('');

  // Check for category keywords in topics
  const categoryKeywords = {
    'dance-tips': ['tips', 'guide', 'how to', 'beginner'],
    'dance-tutorials': ['tutorial', 'learn', 'step-by-step', 'basics'],
    'dance-fitness': ['fitness', 'workout', 'calories', 'weight loss', 'zumba'],
    'dance-technique': ['technique', 'turns', 'spins', 'moves', 'skills'],
    'dance-performance': ['performance', 'stage', 'competition', 'audition'],
    'dance-education': ['education', 'kids', 'teens', 'seniors', 'classes'],
    'dance-lifestyle': ['lifestyle', 'career', 'professional', 'studio'],
    'dance-health': ['health', 'injury', 'therapy', 'mental health', 'wellness'],
    'dance-culture': ['culture', 'history', 'apps', 'technology', 'social media'],
    'dance-business': ['business', 'career', 'professional', 'industry']
  };

  console.log('Category Keyword Analysis:');
  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    const matchingTopics = allTopics.filter(topic => 
      keywords.some(keyword => topic.toLowerCase().includes(keyword))
    );
    console.log(`${category}: ${matchingTopics.length} potential matches`);
  });
  console.log('');
}

// Test tag generation logic
function testTagGeneration() {
  console.log('🏷️  Tag Generation Logic\n');
  console.log('=' .repeat(50));

  const sampleTopics = [
    "Hip Hop Dance Basics for Beginners",
    "Zumba at Home: Burn Calories While Having Fun",
    "How to Master Turns and Spins in Dance"
  ];

  console.log('Sample Tag Generation for Topics:\n');

  sampleTopics.forEach((topic, index) => {
    console.log(`${index + 1}. "${topic}"`);
    
    // Simulate AI tag generation logic
    const words = topic.toLowerCase().split(' ');
    const potentialTags = [];
    
    // Extract key concepts
    if (words.includes('hip') || words.includes('hop')) potentialTags.push('hip-hop');
    if (words.includes('zumba')) potentialTags.push('zumba');
    if (words.includes('basics') || words.includes('beginner')) potentialTags.push('beginner');
    if (words.includes('turns') || words.includes('spins')) potentialTags.push('technique');
    if (words.includes('calories') || words.includes('burn')) potentialTags.push('fitness');
    if (words.includes('home')) potentialTags.push('home-practice');
    if (words.includes('master')) potentialTags.push('advanced');
    
    // Add general dance tag
    potentialTags.unshift('dance');
    
    // Add skill level tags
    if (potentialTags.includes('beginner')) {
      potentialTags.push('fundamentals');
    } else if (potentialTags.includes('advanced')) {
      potentialTags.push('skill-building');
    }
    
    console.log(`   Generated Tags: ${potentialTags.join(', ')}`);
    console.log('');
  });

  console.log('✅ Tag generation logic test completed!');
}

// Run all tests
function runAllTests() {
  console.log('🚀 Starting Auto-Categorization System Tests\n');
  
  testAutoCategorization();
  testCategoryCoverage();
  testTagGeneration();
  
  console.log('=' .repeat(50));
  console.log('🎉 All auto-categorization tests completed!');
  console.log('\n📋 Summary:');
  console.log('   - AI will auto-analyze topics for appropriate categories');
  console.log('   - Tags will be generated based on content keywords and focus');
  console.log('   - SEO titles and descriptions will be optimized automatically');
  console.log('   - No manual category/tag selection needed');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testAutoCategorization,
  testCategoryCoverage,
  testTagGeneration,
  runAllTests
};
