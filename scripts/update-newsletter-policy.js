import { config } from 'dotenv';
import fs from 'fs';

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

console.log('📋 Newsletter Policy Details:');
console.log(`   Name: ${POLICY_NAME}`);
console.log(`   File: ${POLICY_FILE}`);
console.log(`   Region: ${process.env.AWS_REGION || 'us-east-2'}`);
console.log(`   Table: sway-news-use2`);

// Read the policy document
const policyDocument = fs.readFileSync(POLICY_FILE, 'utf8');

console.log('\n📄 Newsletter Policy Document:');
console.log(policyDocument);

console.log('\n🔒 Security Features Included:');
console.log('✅ No account ID exposure (using * instead of specific account)');
console.log('✅ Descriptive Statement ID (Sid)');
console.log('✅ Complete set of DynamoDB permissions');
console.log('✅ Batch operations for efficiency');
console.log('✅ Table description for debugging');
console.log('✅ ListTables with proper resource scope');

console.log('\n🚀 AWS CLI Commands to create the newsletter policy:');
console.log('\n1. Create the policy:');
console.log(`aws iam create-policy \\`);
console.log(`  --policy-name ${POLICY_NAME} \\`);
console.log(`  --policy-document file://${POLICY_FILE} \\`);
console.log(`  --description "DynamoDB access for Sway newsletter subscribers table"`);

console.log('\n2. Attach the policy to your user:');
console.log(`aws iam attach-user-policy \\`);
console.log(`  --user-name sway-blog \\`);
console.log(`  --policy-arn arn:aws:iam::435656520815:policy/${POLICY_NAME}`);

console.log('\n3. Verify the policy was created and attached:');
console.log(`aws iam get-policy --policy-arn arn:aws:iam::435656520815:policy/${POLICY_NAME}`);
console.log(`aws iam list-attached-user-policies --user-name sway-blog`);

console.log('\n💡 Alternative: Use the AWS Console');
console.log('1. Go to IAM Console > Policies > Create Policy');
console.log('2. Choose JSON tab');
console.log('3. Paste the policy document above');
console.log('4. Name it: SwayNewsletterDynamoDBAccess');
console.log('5. Description: DynamoDB access for Sway newsletter subscribers table');
console.log('6. Click Create Policy');
console.log('7. Go to Users > sway-blog > Add permissions > Attach policies directly');
console.log('8. Search for and select SwayNewsletterDynamoDBAccess');
console.log('9. Click Add permissions');

console.log('\n📝 After creating the policy:');
console.log('1. Wait a few minutes for permissions to propagate');
console.log('2. Run: npm run test:dynamodb');
console.log('3. If successful, run: npm run test:newsletter');
console.log('4. Test newsletter signup functionality');

console.log('\n🔗 Related Commands:');
console.log('- View all policies: aws iam list-policies --scope Local');
console.log('- Check user policies: aws iam list-attached-user-policies --user-name sway-blog');
console.log('- Test DynamoDB access: aws dynamodb list-tables --region us-east-2');
