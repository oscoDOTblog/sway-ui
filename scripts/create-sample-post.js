const { blogService } = require('../src/lib/blogService');

const samplePost = {
  title: "10 Essential Dance Tips for Beginners",
  slug: "10-essential-dance-tips-for-beginners",
  content: `# 10 Essential Dance Tips for Beginners

Dancing is an incredible form of self-expression and exercise that anyone can learn. Whether you're just starting your dance journey or looking to improve your skills, these essential tips will help you build a strong foundation.

## 1. Start with the Basics

Before diving into complex moves, master the fundamental steps. Every dance style has its basic movements that serve as building blocks for more advanced techniques.

**Key fundamentals to practice:**
- Basic footwork patterns
- Rhythm and timing
- Body posture and alignment
- Weight distribution

## 2. Practice Regularly

Consistency is key in dance. Even 15-30 minutes of daily practice is more effective than sporadic long sessions.

**Create a practice routine:**
- Warm up for 5-10 minutes
- Practice basic moves for 10-15 minutes
- Learn something new for 10-15 minutes
- Cool down and stretch

## 3. Focus on Rhythm and Timing

Dance is fundamentally about moving to music. Develop your sense of rhythm by:

- Counting beats while listening to music
- Clapping or tapping along to different tempos
- Practicing with a metronome
- Dancing to various music genres

## 4. Maintain Proper Posture

Good posture is essential for both aesthetics and injury prevention.

**Posture checklist:**
- Keep your head up and eyes forward
- Roll your shoulders back and down
- Engage your core muscles
- Keep your knees slightly bent
- Distribute weight evenly

## 5. Use a Mirror

Practice in front of a mirror to:
- See your form and technique
- Identify areas for improvement
- Build confidence in your movements
- Ensure you're executing moves correctly

## 6. Record Yourself

Videotaping your practice sessions provides valuable feedback that you might miss in the moment.

**What to look for:**
- Timing and rhythm
- Body alignment
- Movement quality
- Facial expressions
- Overall performance

## 7. Learn from Multiple Sources

Expand your knowledge by learning from various teachers and resources:

- Take classes from different instructors
- Watch online tutorials
- Study dance videos
- Read dance books and articles
- Join dance communities

## 8. Don't Compare Yourself to Others

Everyone's dance journey is unique. Focus on your own progress and celebrate your achievements.

**Remember:**
- Everyone starts somewhere
- Progress takes time
- Your style is unique
- Focus on improvement, not perfection

## 9. Stay Hydrated and Take Breaks

Dancing is physically demanding. Take care of your body:

- Drink water before, during, and after practice
- Take regular breaks to rest
- Listen to your body's signals
- Don't push through pain

## 10. Have Fun!

Most importantly, enjoy the process! Dance should bring you joy and fulfillment.

**Ways to keep it fun:**
- Dance to music you love
- Practice with friends
- Set achievable goals
- Celebrate small victories
- Try new dance styles

## Conclusion

Remember that every professional dancer was once a beginner. With patience, practice, and passion, you can develop into a confident and skilled dancer. Start with these fundamentals, stay consistent, and most importantly, enjoy the journey!

---

*Ready to take your dance skills to the next level? Check out our other tutorials and resources on Sway Quest!*`,
  excerpt: "Master the fundamentals of dance with these 10 essential tips for beginners. From basic footwork to proper posture, learn how to build a strong foundation for your dance journey.",
  author: "Sway Team",
  category: "dance-tips",
  tags: ["beginner", "dance-tips", "fundamentals", "practice", "rhythm"],
  featuredImage: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  seoTitle: "10 Essential Dance Tips for Beginners - Master the Fundamentals",
  seoDescription: "Learn the 10 essential dance tips every beginner needs to know. From basic footwork to proper posture, build a strong foundation for your dance journey with expert guidance.",
  status: "published"
};

async function createSamplePost() {
  try {
    console.log('🚀 Creating sample blog post...');
    
    const post = await blogService.createPost(samplePost);
    
    console.log('✅ Sample blog post created successfully!');
    console.log(`📝 Title: ${post.title}`);
    console.log(`🔗 Slug: ${post.slug}`);
    console.log(`📅 Published: ${post.publishedAt}`);
    console.log(`👤 Author: ${post.author}`);
    console.log(`📊 Read time: ${post.readTime} minutes`);
    
    console.log('\n🌐 Your blog post is now live at:');
    console.log(`   - Blog index: /blog`);
    console.log(`   - Individual post: /blog/${post.slug}`);
    console.log(`   - API endpoint: /api/blog/${post.slug}`);
    
    console.log('\n🎉 You can now test your blog system!');
    
  } catch (error) {
    console.error('❌ Error creating sample blog post:', error.message);
    
    if (error.message.includes('does not exist')) {
      console.log('\n💡 Please run the setup script first:');
      console.log('   npm run setup:blog');
    }
    
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  createSamplePost();
}

module.exports = { createSamplePost };
