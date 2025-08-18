import { config } from 'dotenv';
import { DynamoDBClient, UpdateTableCommand, DescribeTableCommand } from '@aws-sdk/client-dynamodb';
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
const BLOG_TABLE_NAME = process.env.AWS_DYNAMODB_BLOG || 'sway-blog-use2';

async function waitForIndexActive(tableName, indexName) {
  console.log(`⏳ Waiting for index ${indexName} to become active...`);
  
  while (true) {
    try {
      const command = new DescribeTableCommand({ TableName: tableName });
      const response = await dynamoDocClient.send(command);
      
      const index = response.Table.GlobalSecondaryIndexes?.find(idx => idx.IndexName === indexName);
      
      if (index && index.IndexStatus === 'ACTIVE') {
        console.log(`✅ Index ${indexName} is now active`);
        return true;
      }
      
      const status = index?.IndexStatus || 'NOT_FOUND';
      console.log(`⏳ Index status: ${status}`);
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
    } catch (error) {
      console.error(`❌ Error checking index status: ${error.message}`);
      throw error;
    }
  }
}

async function addBlogIndex() {
  console.log('🔧 Adding status-published-index to blog table...\n');

  try {
    // First, check if the index already exists
    console.log('📊 Checking current table structure...');
    const describeCommand = new DescribeTableCommand({ TableName: BLOG_TABLE_NAME });
    const describeResult = await dynamoDocClient.send(describeCommand);
    
    const existingIndex = describeResult.Table.GlobalSecondaryIndexes?.find(
      index => index.IndexName === 'status-published-index'
    );

    if (existingIndex) {
      console.log('✅ status-published-index already exists!');
      console.log(`   Status: ${existingIndex.IndexStatus}`);
      return;
    }

    console.log('❌ status-published-index not found. Creating it now...');

    // Add the GSI - using the actual table structure with pk and createdAt
    const updateCommand = new UpdateTableCommand({
      TableName: BLOG_TABLE_NAME,
      AttributeDefinitions: [
        { AttributeName: 'status', AttributeType: 'S' },
        { AttributeName: 'publishedAt', AttributeType: 'S' }
      ],
      GlobalSecondaryIndexUpdates: [
        {
          Create: {
            IndexName: 'status-published-index',
            KeySchema: [
              { AttributeName: 'status', KeyType: 'HASH' },
              { AttributeName: 'publishedAt', KeyType: 'RANGE' }
            ],
            Projection: {
              ProjectionType: 'ALL'
            }
          }
        }
      ]
    });

    console.log('🚀 Creating status-published-index...');
    await dynamoDocClient.send(updateCommand);
    
    // Wait for the index to become active
    await waitForIndexActive(BLOG_TABLE_NAME, 'status-published-index');
    
    console.log('\n🎉 status-published-index created successfully!');
    console.log('   This index will enable efficient querying of recent blog posts.');
    console.log('   Your blog page will now scale efficiently with any number of posts.');

  } catch (error) {
    console.error('❌ Failed to add blog index:', error.message);
    
    if (error.name === 'AccessDeniedException') {
      console.log('\n💡 Troubleshooting:');
      console.log('1. Check your AWS credentials');
      console.log('2. Verify your IAM permissions include DynamoDB:UpdateTable');
      console.log('3. Ensure the table exists in the correct region');
    } else if (error.name === 'ResourceNotFoundException') {
      console.log('\n💡 The blog table does not exist. Please create it first:');
      console.log('   node scripts/setup-blog-table.js');
    } else if (error.name === 'ResourceInUseException') {
      console.log('\n💡 The table is being updated. Please wait a moment and try again.');
    } else if (error.name === 'ValidationException') {
      console.log('\n💡 Validation error. This might be because:');
      console.log('1. The table uses on-demand billing (no provisioned throughput needed)');
      console.log('2. The attributes are not defined in the table');
    }
    
    process.exit(1);
  }
}

// Run the script
addBlogIndex().catch(console.error);
