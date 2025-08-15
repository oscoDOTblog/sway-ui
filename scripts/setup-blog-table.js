const { DynamoDBClient, CreateTableCommand, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');

// AWS Configuration
const awsConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};

const dynamoClient = new DynamoDBClient(awsConfig);

// Blog posts table configuration
const BLOG_POSTS_TABLE = process.env.AWS_DYNAMODB_BLOG || 'sway-blog-posts';

const blogPostsTable = {
  TableName: BLOG_POSTS_TABLE,
  KeySchema: [
    { AttributeName: 'id', KeyType: 'HASH' }
  ],
  AttributeDefinitions: [
    { AttributeName: 'id', AttributeType: 'S' },
    { AttributeName: 'slug', AttributeType: 'S' },
    { AttributeName: 'category', AttributeType: 'S' },
    { AttributeName: 'status', AttributeType: 'S' },
    { AttributeName: 'publishedAt', AttributeType: 'S' },
    { AttributeName: 'lastModified', AttributeType: 'S' }
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'slug-index',
      KeySchema: [
        { AttributeName: 'slug', KeyType: 'HASH' }
      ],
      Projection: {
        ProjectionType: 'ALL'
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    },
    {
      IndexName: 'category-index',
      KeySchema: [
        { AttributeName: 'category', KeyType: 'HASH' },
        { AttributeName: 'publishedAt', KeyType: 'RANGE' }
      ],
      Projection: {
        ProjectionType: 'ALL'
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    },
    {
      IndexName: 'status-published-index',
      KeySchema: [
        { AttributeName: 'status', KeyType: 'HASH' },
        { AttributeName: 'publishedAt', KeyType: 'RANGE' }
      ],
      Projection: {
        ProjectionType: 'ALL'
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    },
    {
      IndexName: 'last-modified-index',
      KeySchema: [
        { AttributeName: 'lastModified', KeyType: 'HASH' }
      ],
      Projection: {
        ProjectionType: 'ALL'
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
};

async function tableExists(tableName) {
  try {
    const command = new DescribeTableCommand({
      TableName: tableName,
    });
    await dynamoClient.send(command);
    return true;
  } catch (error) {
    if (error.name === 'ResourceNotFoundException') {
      return false;
    }
    throw error;
  }
}

async function waitForTableActive(tableName) {
  console.log(`⏳ Waiting for table ${tableName} to become active...`);
  
  while (true) {
    try {
      const command = new DescribeTableCommand({
        TableName: tableName,
      });
      const response = await dynamoClient.send(command);
      
      if (response.Table.TableStatus === 'ACTIVE') {
        console.log(`✅ Table ${tableName} is now active`);
        return true;
      }
      
      console.log(`⏳ Table status: ${response.Table.TableStatus}`);
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    } catch (error) {
      console.error(`❌ Error checking table status: ${error.message}`);
      throw error;
    }
  }
}

async function createBlogPostsTable() {
  try {
    console.log(`🚀 Setting up blog posts table: ${BLOG_POSTS_TABLE}`);
    
    // Check if table already exists
    if (await tableExists(BLOG_POSTS_TABLE)) {
      console.log(`✅ Table ${BLOG_POSTS_TABLE} already exists`);
      return;
    }
    
    // Create the table
    const createCommand = new CreateTableCommand(blogPostsTable);
    await dynamoClient.send(createCommand);
    
    console.log(`✅ Table ${BLOG_POSTS_TABLE} created successfully`);
    
    // Wait for table to become active
    await waitForTableActive(BLOG_POSTS_TABLE);
    
    console.log(`🎉 Blog posts table setup complete!`);
    console.log(`📝 Table name: ${BLOG_POSTS_TABLE}`);
    console.log(`🔗 Region: ${awsConfig.region}`);
    
    // Display table structure
    console.log(`\n📊 Table Structure:`);
    console.log(`   Primary Key: id (String)`);
    console.log(`   Global Secondary Indexes:`);
    console.log(`   - slug-index: slug (String)`);
    console.log(`   - category-index: category (String) + publishedAt (String)`);
    console.log(`   - status-published-index: status (String) + publishedAt (String)`);
    console.log(`   - last-modified-index: lastModified (String)`);
    
    console.log(`\n🚀 Your blog system is ready to use!`);
    console.log(`   - Blog index: /blog`);
    console.log(`   - Individual posts: /blog/[slug]`);
    console.log(`   - API endpoints: /api/blog`);
    
  } catch (error) {
    console.error(`❌ Error creating blog posts table: ${error.message}`);
    
    if (error.name === 'ResourceInUseException') {
      console.log(`ℹ️  Table ${BLOG_POSTS_TABLE} is being created. Please wait a moment and try again.`);
    } else if (error.name === 'AccessDeniedException') {
      console.log(`❌ Access denied. Please check your AWS credentials and permissions.`);
    } else {
      console.log(`❌ Unexpected error: ${error.name}`);
    }
    
    process.exit(1);
  }
}

// Run the setup
if (require.main === module) {
  createBlogPostsTable();
}

module.exports = { createBlogPostsTable };
