import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';

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
export const s3Client = new S3Client(awsConfig);

// DynamoDB table names
export const BLOG_POSTS_TABLE = process.env.AWS_DYNAMODB_BLOG || 'sway-blog-posts';
export const NEWSLETTER_TABLE = process.env.AWS_DYNAMODB_NEWS || 'sway-news-use2';

// S3 bucket names
export const BLOG_IMAGES_BUCKET = process.env.AWS_S3_BLOG || 'sway-public-use2';

// Debug logging
if (process.env.NODE_ENV === 'development') {
  console.log('AWS Config:', {
    region: awsConfig.region,
    blogTable: BLOG_POSTS_TABLE,
    newsletterTable: NEWSLETTER_TABLE,
    blogImagesBucket: BLOG_IMAGES_BUCKET,
  });
}
