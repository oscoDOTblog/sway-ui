import { createClient } from '@supabase/supabase-js';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize DynamoDB client
const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient);
const TABLE_NAME = 'sway-news-use2';

// Helper function to generate subscriber ID
function generateSubscriberId() {
  return `sub_${uuidv4().replace(/-/g, '').substring(0, 12)}`;
}

// Helper function to transform Supabase data to DynamoDB format
function transformSubscriber(supabaseRecord) {
  const now = new Date().toISOString();
  
  return {
    email: supabaseRecord.email,
    subscriberId: generateSubscriberId(),
    subscribedAt: supabaseRecord.subscribed_at || supabaseRecord.created_at,
    source: supabaseRecord.source || 'sway-ui',
    status: 'active',
    emailCount: 0,
    openRate: 0,
    clickRate: 0,
    createdAt: supabaseRecord.created_at || now,
    updatedAt: supabaseRecord.updated_at || now,
    tags: ['newsletter'],
    preferences: {
      frequency: 'weekly',
      categories: ['dance', 'music']
    }
  };
}

// Function to migrate a single subscriber
async function migrateSubscriber(subscriber) {
  try {
    const dynamoRecord = transformSubscriber(subscriber);
    
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: dynamoRecord,
      ConditionExpression: 'attribute_not_exists(email) AND attribute_not_exists(subscriberId)'
    });
    
    await dynamoDocClient.send(command);
    console.log(`✅ Migrated: ${subscriber.email}`);
    return { success: true, email: subscriber.email };
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') {
      console.log(`⚠️ Already exists: ${subscriber.email}`);
      return { success: false, email: subscriber.email, reason: 'already_exists' };
    }
    console.error(`❌ Failed to migrate ${subscriber.email}:`, error.message);
    return { success: false, email: subscriber.email, reason: 'error', error: error.message };
  }
}

// Function to migrate all subscribers
async function migrateAllSubscribers() {
  try {
    console.log('🔄 Starting newsletter migration from Supabase to DynamoDB...');
    
    // Fetch all subscribers from Supabase
    const { data: subscribers, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      throw new Error(`Supabase query failed: ${error.message}`);
    }
    
    console.log(`📊 Found ${subscribers.length} subscribers to migrate`);
    
    if (subscribers.length === 0) {
      console.log('✅ No subscribers to migrate');
      return;
    }
    
    // Process subscribers in batches of 25 (DynamoDB batch limit)
    const batchSize = 25;
    const results = {
      successful: 0,
      alreadyExists: 0,
      failed: 0,
      errors: []
    };
    
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(subscribers.length / batchSize)}`);
      
      // Process batch items individually for better error handling
      for (const subscriber of batch) {
        const result = await migrateSubscriber(subscriber);
        
        if (result.success) {
          results.successful++;
        } else if (result.reason === 'already_exists') {
          results.alreadyExists++;
        } else {
          results.failed++;
          results.errors.push({ email: result.email, error: result.error });
        }
        
        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    // Print summary
    console.log('\n📈 Migration Summary:');
    console.log(`✅ Successfully migrated: ${results.successful}`);
    console.log(`⚠️ Already existed: ${results.alreadyExists}`);
    console.log(`❌ Failed: ${results.failed}`);
    
    if (results.errors.length > 0) {
      console.log('\n❌ Errors:');
      results.errors.forEach(({ email, error }) => {
        console.log(`  - ${email}: ${error}`);
      });
    }
    
    console.log('\n🎉 Migration completed!');
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

// Function to verify migration
async function verifyMigration() {
  try {
    console.log('\n🔍 Verifying migration...');
    
    // Count Supabase subscribers
    const { count: supabaseCount, error: supabaseError } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true });
    
    if (supabaseError) {
      throw new Error(`Supabase count failed: ${supabaseError.message}`);
    }
    
    // Count DynamoDB subscribers (approximate)
    const { Count: dynamoCount } = await dynamoDocClient.send({
      TableName: TABLE_NAME,
      Select: 'COUNT'
    });
    
    console.log(`📊 Supabase subscribers: ${supabaseCount}`);
    console.log(`📊 DynamoDB subscribers: ${dynamoCount}`);
    
    if (dynamoCount >= supabaseCount) {
      console.log('✅ Migration verification successful!');
    } else {
      console.log('⚠️ Migration may be incomplete - DynamoDB count is lower than Supabase');
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
  }
}

// Main execution
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'migrate':
      await migrateAllSubscribers();
      break;
    case 'verify':
      await verifyMigration();
      break;
    case 'full':
      await migrateAllSubscribers();
      await verifyMigration();
      break;
    default:
      console.log('Usage: node migrate-newsletter-to-dynamodb.js [migrate|verify|full]');
      console.log('  migrate - Migrate subscribers from Supabase to DynamoDB');
      console.log('  verify  - Verify the migration results');
      console.log('  full    - Run migration and verification');
      process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

export { migrateAllSubscribers, verifyMigration };
