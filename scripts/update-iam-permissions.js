import { config } from 'dotenv';
import { IAMClient, GetUserCommand, ListAttachedUserPoliciesCommand, AttachUserPolicyCommand, CreatePolicyCommand } from '@aws-sdk/client-iam';

// Load environment variables
config({ path: '.env.local' });

const iamClient = new IAMClient({
  region: process.env.AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const TABLE_NAME = 'sway-news-use2';

async function updateIAMPermissions() {
  console.log('🔧 Updating IAM Permissions for DynamoDB Access...\n');

  try {
    // Step 1: Get current user info
    console.log('👤 Step 1: Getting current user info...');
    const getUserCommand = new GetUserCommand({});
    const userResult = await iamClient.send(getUserCommand);
    const userName = userResult.User.UserName;
    console.log(`✅ Current user: ${userName}`);

    // Step 2: Check existing policies
    console.log('\n📋 Step 2: Checking existing policies...');
    const listPoliciesCommand = new ListAttachedUserPoliciesCommand({
      UserName: userName
    });
    const policiesResult = await iamClient.send(listPoliciesCommand);
    
    console.log('Current attached policies:');
    policiesResult.AttachedPolicies.forEach(policy => {
      console.log(`  - ${policy.PolicyName} (${policy.PolicyArn})`);
    });

    // Step 3: Create DynamoDB policy if it doesn't exist
    console.log('\n🔐 Step 3: Creating DynamoDB access policy...');
    
    const policyName = 'SwayNewsletterDynamoDBAccess';
    const policyDocument = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: [
            'dynamodb:GetItem',
            'dynamodb:PutItem',
            'dynamodb:UpdateItem',
            'dynamodb:DeleteItem',
            'dynamodb:Query',
            'dynamodb:Scan',
            'dynamodb:BatchGetItem',
            'dynamodb:BatchWriteItem',
            'dynamodb:DescribeTable',
            'dynamodb:ListTables'
          ],
          Resource: [
            `arn:aws:dynamodb:${process.env.AWS_REGION}:*:table/${TABLE_NAME}`,
            `arn:aws:dynamodb:${process.env.AWS_REGION}:*:table/${TABLE_NAME}/index/*`
          ]
        }
      ]
    };

    try {
      const createPolicyCommand = new CreatePolicyCommand({
        PolicyName: policyName,
        PolicyDocument: JSON.stringify(policyDocument),
        Description: 'DynamoDB access for Sway newsletter subscribers table'
      });
      
      const policyResult = await iamClient.send(createPolicyCommand);
      console.log(`✅ Created policy: ${policyResult.Policy.PolicyArn}`);
      
      // Step 4: Attach policy to user
      console.log('\n🔗 Step 4: Attaching policy to user...');
      const attachPolicyCommand = new AttachUserPolicyCommand({
        UserName: userName,
        PolicyArn: policyResult.Policy.PolicyArn
      });
      
      await iamClient.send(attachPolicyCommand);
      console.log(`✅ Attached policy to user ${userName}`);
      
    } catch (error) {
      if (error.name === 'EntityAlreadyExistsException') {
        console.log(`⚠️ Policy ${policyName} already exists`);
        
        // Try to attach existing policy
        const existingPolicyArn = `arn:aws:iam::${process.env.AWS_ACCOUNT_ID || '*'}:policy/${policyName}`;
        try {
          const attachPolicyCommand = new AttachUserPolicyCommand({
            UserName: userName,
            PolicyArn: existingPolicyArn
          });
          
          await iamClient.send(attachPolicyCommand);
          console.log(`✅ Attached existing policy to user ${userName}`);
        } catch (attachError) {
          if (attachError.name === 'NoSuchEntityException') {
            console.log('⚠️ Policy exists but could not attach (may already be attached)');
          } else {
            throw attachError;
          }
        }
      } else {
        throw error;
      }
    }

    console.log('\n🎉 IAM permissions updated successfully!');
    console.log('\n📝 Next Steps:');
    console.log('1. Wait a few minutes for permissions to propagate');
    console.log('2. Run: npm run test:dynamodb');
    console.log('3. If successful, run: npm run test:newsletter');

  } catch (error) {
    console.error('❌ Failed to update IAM permissions:', error.message);
    
    if (error.name === 'AccessDeniedException') {
      console.log('\n💡 You need admin permissions to update IAM policies');
      console.log('Please ask your AWS administrator to:');
      console.log('1. Create a policy with the following permissions:');
      console.log('   - dynamodb:GetItem, PutItem, UpdateItem, DeleteItem');
      console.log('   - dynamodb:Query, Scan, BatchGetItem, BatchWriteItem');
      console.log('   - dynamodb:DescribeTable, ListTables');
      console.log(`2. Attach it to user: ${process.env.AWS_ACCESS_KEY_ID}`);
      console.log(`3. Resource: arn:aws:dynamodb:${process.env.AWS_REGION}:*:table/${TABLE_NAME}/*');
    }
    
    process.exit(1);
  }
}

// Run the script
updateIAMPermissions().catch(console.error);
