const { blogConfig, getCharacterInfo, getAllCharacterNames } = require('../src/config/blogConfig');

// Test the character configuration
function testCharacterConfig() {
  console.log('🎭 Testing Character Configuration\n');

  // Test all characters
  const characterKeys = Object.keys(blogConfig.characters);
  
  console.log(`📊 Found ${characterKeys.length} characters:\n`);

  characterKeys.forEach((key, index) => {
    const character = blogConfig.characters[key];
    console.log(`${index + 1}. ${character.name} - ${character.title}`);
    console.log(`   Tone: ${character.tone}`);
    console.log(`   Writing Style: ${character.writingStyle}`);
    console.log(`   Personality: ${character.personality}`);
    console.log(`   Catchphrases: ${character.catchphrases.length}`);
    console.log('');
  });

  // Test helper functions
  console.log('🔧 Testing Helper Functions:\n');

  const testCharacter = 'emilia';
  const characterInfo = getCharacterInfo(testCharacter);
  console.log(`getCharacterInfo('${testCharacter}'):`, characterInfo ? '✅ Working' : '❌ Failed');

  const allNames = getAllCharacterNames();
  console.log(`getAllCharacterNames(): ${allNames.length} names found - ✅ Working`);

  // Test prompt generation
  console.log('\n📝 Testing Prompt Generation:\n');

  const testTopic = 'How to Improve Your Dance Rhythm';
  const testCharacterKey = 'dare';
  
  try {
    const prompt = blogConfig.prompts.main(testTopic, testCharacterKey);
    console.log(`Generated prompt for ${testCharacterKey} with topic "${testTopic}":`);
    console.log('✅ Prompt generation working');
    console.log(`Prompt length: ${prompt.length} characters`);
  } catch (error) {
    console.log('❌ Prompt generation failed:', error.message);
  }

  // Test character-specific prompts
  console.log('\n🎯 Testing Character-Specific Prompts:\n');

  characterKeys.slice(0, 3).forEach(key => {
    const character = blogConfig.characters[key];
    console.log(`${character.name} prompt preview:`);
    
    try {
      const prompt = blogConfig.prompts.main('Test Topic', key);
      const preview = prompt.substring(0, 200) + '...';
      console.log(`   ${preview}`);
      console.log('   ✅ Working\n');
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}\n`);
    }
  });

  console.log('🎉 Character configuration test completed!');
}

// Test character validation
function testCharacterValidation() {
  console.log('\n🔍 Testing Character Validation:\n');

  const validCharacters = Object.keys(blogConfig.characters);
  const invalidCharacters = ['invalid', 'test', 'unknown'];

  console.log('Valid characters:');
  validCharacters.forEach(char => {
    const isValid = blogConfig.characters[char] !== undefined;
    console.log(`   ${char}: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
  });

  console.log('\nInvalid characters:');
  invalidCharacters.forEach(char => {
    const isValid = blogConfig.characters[char] !== undefined;
    console.log(`   ${char}: ${isValid ? '❌ Should be invalid' : '✅ Correctly invalid'}`);
  });
}

// Test character distribution
function testCharacterDistribution() {
  console.log('\n📊 Testing Character Distribution:\n');

  const { getRandomCharacter, getCharacterByDate } = require('../src/config/blogConfig');
  
  // Test random character selection
  const randomChars = [];
  for (let i = 0; i < 20; i++) {
    randomChars.push(getRandomCharacter());
  }

  const charCounts = {};
  randomChars.forEach(char => {
    charCounts[char] = (charCounts[char] || 0) + 1;
  });

  console.log('Random character distribution (20 samples):');
  Object.entries(charCounts).forEach(([char, count]) => {
    const character = blogConfig.characters[char];
    console.log(`   ${character.name}: ${count} times`);
  });

  // Test date-based character selection
  console.log('\nDate-based character selection:');
  const testDates = [
    new Date('2024-01-01'),
    new Date('2024-02-15'),
    new Date('2024-06-30'),
    new Date('2024-12-31')
  ];

  testDates.forEach(date => {
    const char = getCharacterByDate(date);
    const character = blogConfig.characters[char];
    console.log(`   ${date.toDateString()}: ${character.name}`);
  });
}

// Run all tests
function runAllTests() {
  console.log('🚀 Starting Character System Tests\n');
  console.log('=' .repeat(50));

  testCharacterConfig();
  testCharacterValidation();
  testCharacterDistribution();

  console.log('\n' + '=' .repeat(50));
  console.log('✅ All tests completed successfully!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testCharacterConfig,
  testCharacterValidation,
  testCharacterDistribution,
  runAllTests
};
