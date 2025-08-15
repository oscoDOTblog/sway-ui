import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// AWS Configuration
const awsConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};

// Initialize AWS clients
export const dynamoClient = new DynamoDBClient(awsConfig);
export const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient);

// DynamoDB table names
export const BLOG_POSTS_TABLE = process.env.AWS_DYNAMODB_BLOG || 'sway-blog-posts';

// Debug logging
if (process.env.NODE_ENV === 'development') {
  console.log('AWS Config:', {
    region: awsConfig.region,
    blogTable: BLOG_POSTS_TABLE,
  });
}
