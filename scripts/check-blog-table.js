import { config } from 'dotenv';
import { DynamoDBClient, DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// Load environment variables
config({ path: '.env.local' });

// Check if AWS credentials are available
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.error('❌ AWS credentials not found in environment variables');
  console.log('Please ensure AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are set in .env.local');
  process.exit(1);
}

// Initialize DynamoDB client
const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient);
const BLOG_TABLE_NAME = process.env.AWS_DYNAMODB_BLOG || 'sway-blog-posts';

async function checkBlogTable() {
  console.log('🔍 Checking Blog Table Structure...\n');

  try {
    // Describe the blog table
    console.log(`📊 Describing table: ${BLOG_TABLE_NAME}`);
    const describeCommand = new DescribeTableCommand({ TableName: BLOG_TABLE_NAME });
    const describeResult = await dynamoDocClient.send(describeCommand);
    
    const table = describeResult.Table;
    console.log(`✅ Table Name: ${table.TableName}`);
    console.log(`📈 Table Status: ${table.TableStatus}`);
    console.log(`📊 Item Count: ${table.ItemCount || 'N/A'}`);
    console.log(`💰 Billing Mode: ${table.BillingModeSummary?.BillingMode || 'N/A'}`);
    
    // Show key schema
    console.log('\n🔑 Primary Key Schema:');
    table.KeySchema.forEach(key => {
      console.log(`  - ${key.AttributeName} (${key.KeyType})`);
    });

    // Show attribute definitions
    console.log('\n📝 Attribute Definitions:');
    table.AttributeDefinitions.forEach(attr => {
      console.log(`  - ${attr.AttributeName} (${attr.AttributeType})`);
    });

    // Show indexes
    if (table.GlobalSecondaryIndexes && table.GlobalSecondaryIndexes.length > 0) {
      console.log('\n📈 Global Secondary Indexes:');
      table.GlobalSecondaryIndexes.forEach(index => {
        console.log(`  ✅ ${index.IndexName}:`);
        console.log(`     Key Schema: ${index.KeySchema.map(k => k.AttributeName).join(' + ')}`);
        console.log(`     Status: ${index.IndexStatus}`);
        console.log(`     Projection: ${index.Projection.ProjectionType}`);
        if (index.Projection.NonKeyAttributes) {
          console.log(`     Non-Key Attributes: ${index.Projection.NonKeyAttributes.join(', ')}`);
        }
        console.log('');
      });
    } else {
      console.log('\n❌ No Global Secondary Indexes found');
    }

    // Check if the status-published-index exists
    const statusPublishedIndex = table.GlobalSecondaryIndexes?.find(
      index => index.IndexName === 'status-published-index'
    );

    if (statusPublishedIndex) {
      console.log('✅ status-published-index exists and is ready to use!');
      console.log('   This index will be used for efficient querying of recent posts.');
    } else {
      console.log('❌ status-published-index is missing!');
      console.log('   You need to create this index for efficient blog queries.');
      console.log('\n💡 To create the index, run:');
      console.log('   node scripts/setup-blog-table.js');
    }

    console.log('\n🎉 Blog table check complete!');

  } catch (error) {
    console.error('❌ Blog table check failed:', error.message);
    
    if (error.name === 'AccessDeniedException') {
      console.log('\n💡 Troubleshooting:');
      console.log('1. Check your AWS credentials');
      console.log('2. Verify your IAM permissions include DynamoDB access');
      console.log('3. Ensure the table exists in the correct region');
    } else if (error.name === 'ResourceNotFoundException') {
      console.log('\n💡 The blog table does not exist. Please create it first:');
      console.log('   node scripts/setup-blog-table.js');
    }
    
    process.exit(1);
  }
}

// Run the check
checkBlogTable().catch(console.error);
