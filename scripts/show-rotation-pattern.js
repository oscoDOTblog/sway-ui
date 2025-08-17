#!/usr/bin/env node

// Script to show the rotation pattern for blog categories and characters
import { 
  getTopicByCategoryRotation, 
  getCharacterByDate, 
  getCategoryNames,
  blogConfig 
} from '../src/config/blogConfig.js';

console.log('🤖 Blog Automation Rotation Pattern\n');

// Show categories
console.log('📂 Available Categories:');
const categories = getCategoryNames();
categories.forEach((category, index) => {
  console.log(`  ${index + 1}. ${category}`);
});

console.log('\n👥 Available Characters:');
const characterNames = Object.values(blogConfig.characters).map(char => char.name);
characterNames.forEach((name, index) => {
  console.log(`  ${index + 1}. ${name}`);
});

console.log('\n📅 Next 7 Days Rotation Pattern:');
console.log('┌─────────────┬─────────────┬─────────────────┬─────────────────┐');
console.log('│    Date     │   Category   │    Character    │   Example Slug  │');
console.log('├─────────────┼─────────────┼─────────────────┼─────────────────┤');

const today = new Date();
for (let i = 0; i < 7; i++) {
  const date = new Date(today);
  date.setDate(today.getDate() + i);
  
  const category = getTopicByCategoryRotation(date);
  const character = getCharacterByDate(date);
  const characterName = blogConfig.characters[character]?.name || character;
  
  // Example topic from that category
  const categoryTopics = blogConfig.topics[category] || [];
  const exampleTopic = categoryTopics[0] || 'Example Topic';
  
  // Generate example slug
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const exampleSlug = `${year}-${month}-${day}-${exampleTopic.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}`;
  
  const dateStr = date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
  
  console.log(`│ ${dateStr.padEnd(11)} │ ${category.padEnd(11)} │ ${characterName.padEnd(15)} │ ${exampleSlug.substring(0, 15)}... │`);
}

console.log('└─────────────┴─────────────┴─────────────────┴─────────────────┘');

console.log('\n💡 Rotation Logic:');
console.log('• Categories: Cycles through all categories based on day of year');
console.log('• Characters: Cycles through all characters based on day of year');
console.log('• Slugs: Include date prefix (YYYY-MM-DD) for better SEO');
console.log('• Topics: Random selection from the day\'s assigned category');

console.log('\n🎯 Benefits:');
console.log('✅ Ensures variety across all content categories');
console.log('✅ Provides consistent character rotation');
console.log('✅ Date-based slugs improve SEO and organization');
console.log('✅ Deterministic - same day always produces same category/character');
console.log('✅ No manual scheduling required');
