import { config } from 'dotenv';
import fs from 'fs';

// Load environment variables
config({ path: '.env.local' });

const POLICY_NAME = 'SwayBlogDynamoDBAccess';
const POLICY_FILE = 'infrastructure/blog-dynamodb-policy.json';

console.log('🔧 Updating Blog DynamoDB Policy...\n');

// Check if policy file exists
if (!fs.existsSync(POLICY_FILE)) {
  console.error(`❌ Policy file not found: ${POLICY_FILE}`);
  process.exit(1);
}

console.log('📋 Blog Policy Details:');
console.log(`   Name: ${POLICY_NAME}`);
console.log(`   File: ${POLICY_FILE}`);
console.log(`   Region: ${process.env.AWS_REGION || 'us-east-2'}`);
console.log(`   Table: sway-blog-use2`);

// Read the policy document
const policyDocument = fs.readFileSync(POLICY_FILE, 'utf8');

console.log('\n📄 Updated Blog Policy Document:');
console.log(policyDocument);

console.log('\n🔒 Security Improvements Applied:');
console.log('✅ Removed account ID exposure (using * instead of 435656520815)');
console.log('✅ Added descriptive Statement ID (Sid)');
console.log('✅ Added BatchGetItem and BatchWriteItem permissions');
console.log('✅ Added DescribeTable permission');
console.log('✅ Added ListTables permission with proper resource scope');

console.log('\n🚀 AWS CLI Commands to update your existing blog policy:');
console.log('\n1. Update the existing policy:');
console.log(`aws iam create-policy-version \\`);
console.log(`  --policy-arn arn:aws:iam::435656520815:policy/YOUR_BLOG_POLICY_NAME \\`);
console.log(`  --policy-document file://${POLICY_FILE} \\`);
console.log(`  --set-as-default`);

console.log('\n2. Verify the policy was updated:');
console.log(`aws iam get-policy-version \\`);
console.log(`  --policy-arn arn:aws:iam::435656520815:policy/YOUR_BLOG_POLICY_NAME \\`);
console.log(`  --version-id v2`);

console.log('\n💡 Alternative: Use the AWS Console');
console.log('1. Go to IAM Console > Policies');
console.log('2. Find your existing blog policy');
console.log('3. Click "Edit policy"');
console.log('4. Choose JSON tab');
console.log('5. Replace with the policy document above');
console.log('6. Click "Review policy" and save');

console.log('\n⚠️ Important Notes:');
console.log('- Replace YOUR_BLOG_POLICY_NAME with your actual policy name');
console.log('- This will create a new version of your existing policy');
console.log('- The new version will become the default');
console.log('- Old versions will be automatically deleted (AWS keeps max 5 versions)');

console.log('\n📝 After updating the policy:');
console.log('1. Wait a few minutes for permissions to propagate');
console.log('2. Test your blog functionality');
console.log('3. Run: npm run test:newsletter-service');
