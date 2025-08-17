import { config } from 'dotenv';
import { DynamoDBClient, ListTablesCommand, DescribeTableCommand } from '@aws-sdk/client-dynamodb';
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
const TABLE_NAME = 'sway-news-use2';

async function testConnection() {
  console.log('🔍 Testing DynamoDB Connection...\n');

  try {
    // Test 1: List tables
    console.log('📋 Test 1: Listing tables...');
    const listCommand = new ListTablesCommand({});
    const listResult = await dynamoDocClient.send(listCommand);
    
    console.log('Available tables:', listResult.TableNames);
    
    if (listResult.TableNames.includes(TABLE_NAME)) {
      console.log(`✅ Table "${TABLE_NAME}" found!`);
    } else {
      console.log(`❌ Table "${TABLE_NAME}" not found`);
      console.log('Please create the table first using the CloudFormation template');
      return;
    }

    // Test 2: Describe table
    console.log('\n📊 Test 2: Describing table...');
    const describeCommand = new DescribeTableCommand({ TableName: TABLE_NAME });
    const describeResult = await dynamoDocClient.send(describeCommand);
    
    const table = describeResult.Table;
    console.log(`Table Name: ${table.TableName}`);
    console.log(`Table Status: ${table.TableStatus}`);
    console.log(`Item Count: ${table.ItemCount || 'N/A'}`);
    console.log(`Billing Mode: ${table.BillingModeSummary?.BillingMode || 'N/A'}`);
    
    // Show key schema
    console.log('\n🔑 Key Schema:');
    table.KeySchema.forEach(key => {
      console.log(`  - ${key.AttributeName} (${key.KeyType})`);
    });

    // Show indexes
    if (table.GlobalSecondaryIndexes && table.GlobalSecondaryIndexes.length > 0) {
      console.log('\n📈 Global Secondary Indexes:');
      table.GlobalSecondaryIndexes.forEach(index => {
        console.log(`  - ${index.IndexName}: ${index.KeySchema.map(k => k.AttributeName).join(' + ')}`);
      });
    }

    console.log('\n✅ DynamoDB connection test successful!');
    console.log('🎉 You can now run the newsletter service tests');

  } catch (error) {
    console.error('❌ DynamoDB connection test failed:', error.message);
    
    if (error.name === 'AccessDeniedException') {
      console.log('\n💡 Troubleshooting:');
      console.log('1. Check your AWS credentials');
      console.log('2. Verify your IAM permissions include DynamoDB access');
      console.log('3. Ensure the table exists in the correct region');
    } else if (error.name === 'ResourceNotFoundException') {
      console.log('\n💡 The table does not exist. Please create it first:');
      console.log('aws cloudformation deploy --template-file infrastructure/newsletter-table.yaml --stack-name sway-newsletter-subscribers');
    }
    
    process.exit(1);
  }
}

// Run the test
testConnection().catch(console.error);
