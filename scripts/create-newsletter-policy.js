import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
config({ path: '.env.local' });

const POLICY_NAME = 'SwayNewsletterDynamoDBAccess';
const POLICY_FILE = 'infrastructure/newsletter-dynamodb-policy.json';

console.log('🔧 Creating Newsletter DynamoDB Policy...\n');

// Check if policy file exists
if (!fs.existsSync(POLICY_FILE)) {
  console.error(`❌ Policy file not found: ${POLICY_FILE}`);
  process.exit(1);
}

console.log('📋 Policy Details:');
console.log(`   Name: ${POLICY_NAME}`);
console.log(`   File: ${POLICY_FILE}`);
console.log(`   Region: ${process.env.AWS_REGION || 'us-east-2'}`);
console.log(`   Table: sway-news-use2`);

// Read the policy document
const policyDocument = fs.readFileSync(POLICY_FILE, 'utf8');

console.log('\n📄 Policy Document:');
console.log(policyDocument);

console.log('\n🚀 AWS CLI Commands to run:');
console.log('\n1. Create the policy:');
console.log(`aws iam create-policy \\`);
console.log(`  --policy-name ${POLICY_NAME} \\`);
console.log(`  --policy-document file://${POLICY_FILE} \\`);
console.log(`  --description "DynamoDB access for Sway newsletter subscribers table"`);

console.log('\n2. Attach the policy to your user:');
console.log(`aws iam attach-user-policy \\`);
console.log(`  --user-name sway-blog \\`);
console.log(`  --policy-arn arn:aws:iam::${process.env.AWS_ACCOUNT_ID || 'YOUR_ACCOUNT_ID'}:policy/${POLICY_NAME}`);

console.log('\n3. Verify the policy was attached:');
console.log(`aws iam list-attached-user-policies --user-name sway-blog`);

console.log('\n💡 Alternative: Use the AWS Console');
console.log('1. Go to IAM Console > Policies > Create Policy');
console.log('2. Choose JSON tab');
console.log('3. Paste the policy document above');
console.log('4. Name it: SwayNewsletterDynamoDBAccess');
console.log('5. Attach it to user: sway-blog');

console.log('\n📝 After creating the policy:');
console.log('1. Wait a few minutes for permissions to propagate');
console.log('2. Run: npm run test:dynamodb');
console.log('3. If successful, run: npm run test:newsletter');
