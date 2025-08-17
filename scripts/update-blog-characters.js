const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

// AWS Configuration
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.BLOG_POSTS_TABLE || 'sway-blog-posts';

// Character mapping for existing posts
const characters = {
  luna: {
    name: "Luna",
    title: "The Cheerleader / Pop Princess",
    tone: "peppy, encouraging, full of sparkle"
  },
  marcus: {
    name: "Marcus",
    title: "The Smooth Operator / R&B Cool",
    tone: "laid-back, confident, smooth-talker"
  },
  alex: {
    name: "Alex",
    title: "The Cocky Showman",
    tone: "bold, cocky, always challenging"
  },
  zara: {
    name: "Zara",
    title: "The Edgy Rebel / Punk Attitude",
    tone: "sharp, rebellious, witty"
  },
  kai: {
    name: "Kai",
    title: "The Mysterious Rival",
    tone: "calm, enigmatic, mentor-like"
  },
  jordan: {
    name: "Jordan",
    title: "The Energetic Bro / Party Starter",
    tone: "fun, sporty, hype like a big brother"
  },
  rio: {
    name: "Rio & Maya",
    title: "The DJ Duo",
    tone: "fast, fun, chaotic duo banter"
  }
};

const characterKeys = Object.keys(characters);

async function updateBlogPosts() {
  try {
    console.log('🔍 Scanning for blog posts to update...');
    
    // Scan all blog posts
    const scanCommand = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'begins_with(pk, :pkPrefix)',
      ExpressionAttributeValues: {
        ':pkPrefix': 'BLOG#',
      },
    });

    const response = await docClient.send(scanCommand);
    const posts = response.Items || [];

    console.log(`📝 Found ${posts.length} blog posts to process`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const post of posts) {
      // Skip posts that already have a character assigned
      if (post.character) {
        console.log(`⏭️  Skipping ${post.slug} - already has character: ${post.character}`);
        skippedCount++;
        continue;
      }

      // Skip posts that don't have "Sway Team" as author
      if (post.author !== 'Sway Team') {
        console.log(`⏭️  Skipping ${post.slug} - author is not "Sway Team": ${post.author}`);
        skippedCount++;
        continue;
      }

      // Assign a random character
      const randomCharacter = characterKeys[Math.floor(Math.random() * characterKeys.length)];
      const characterInfo = characters[randomCharacter];

      console.log(`🎭 Updating ${post.slug} with character: ${characterInfo.name}`);

      // Update the post
      const updateCommand = new UpdateCommand({
        TableName: TABLE_NAME,
        Key: {
          pk: post.pk,
          createdAt: post.createdAt,
        },
        UpdateExpression: 'SET author = :author, character = :character, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':author': characterInfo.name,
          ':character': randomCharacter,
          ':updatedAt': new Date().toISOString(),
        },
      });

      await docClient.send(updateCommand);
      updatedCount++;

      // Add a small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n✅ Update completed!');
    console.log(`📊 Summary:`);
    console.log(`   - Total posts found: ${posts.length}`);
    console.log(`   - Posts updated: ${updatedCount}`);
    console.log(`   - Posts skipped: ${skippedCount}`);

    if (updatedCount > 0) {
      console.log('\n🎭 Character distribution:');
      const characterCounts = {};
      for (const post of posts) {
        if (post.character) {
          characterCounts[post.character] = (characterCounts[post.character] || 0) + 1;
        }
      }
      
      Object.entries(characterCounts).forEach(([character, count]) => {
        const characterName = characters[character]?.name || character;
        console.log(`   - ${characterName}: ${count} posts`);
      });
    }

  } catch (error) {
    console.error('❌ Error updating blog posts:', error);
    process.exit(1);
  }
}

// Run the update
if (require.main === module) {
  updateBlogPosts();
}

module.exports = { updateBlogPosts };
