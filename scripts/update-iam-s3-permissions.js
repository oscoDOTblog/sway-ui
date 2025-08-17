import { IAMClient, AttachRolePolicyCommand, CreatePolicyCommand, GetPolicyCommand } from '@aws-sdk/client-iam';
import { config } from 'dotenv';
import { resolve } from 'path';
import fs from 'fs';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

// Initialize IAM client
const iamClient = new IAMClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function updateIAMPermissions() {
  console.log('🔐 Updating IAM permissions for S3 blog image uploads...\n');

  try {
    const roleName = process.env.AWS_IAM_ROLE_NAME || 'sway-quest-role';
    const policyName = 'SwayBlogS3ImagePolicy';
    const policyArn = `arn:aws:iam::${process.env.AWS_ACCOUNT_ID || '435656520815'}:policy/${policyName}`;

    console.log(`📋 Role Name: ${roleName}`);
    console.log(`📋 Policy Name: ${policyName}`);
    console.log(`📋 Policy ARN: ${policyArn}\n`);

    // Read the S3 policy document
    const policyDocument = fs.readFileSync('./infrastructure/blog-s3-policy.json', 'utf8');
    const policyJson = JSON.parse(policyDocument);

    console.log('📄 Policy document:');
    console.log(JSON.stringify(policyJson, null, 2));
    console.log('');

    // Check if policy already exists
    try {
      await iamClient.send(new GetPolicyCommand({ PolicyArn: policyArn }));
      console.log('✅ Policy already exists, skipping creation');
    } catch (error) {
      if (error.name === 'NoSuchEntity') {
        console.log('📝 Creating new S3 policy...');
        
        // Create the policy
        const createPolicyCommand = new CreatePolicyCommand({
          PolicyName: policyName,
          PolicyDocument: JSON.stringify(policyJson),
          Description: 'S3 permissions for blog image uploads on Sway Quest'
        });

        const createResult = await iamClient.send(createPolicyCommand);
        console.log('✅ Policy created successfully');
        console.log(`📋 Policy ARN: ${createResult.Policy.Arn}`);
      } else {
        throw error;
      }
    }

    console.log('\n🔗 Attaching policy to role...');
    
    // Attach the policy to the role
    const attachCommand = new AttachRolePolicyCommand({
      RoleName: roleName,
      PolicyArn: policyArn
    });

    await iamClient.send(attachCommand);
    console.log('✅ Policy attached to role successfully');

    console.log('\n🎉 IAM permissions updated successfully!');
    console.log('\n📋 Summary:');
    console.log(`   • Role: ${roleName}`);
    console.log(`   • Policy: ${policyName}`);
    console.log(`   • Permissions: S3 PutObject, GetObject, DeleteObject, ListBucket`);
    console.log(`   • Bucket: sway-public-use2`);
    console.log('\n💡 Make sure to create the S3 bucket "sway-public-use2" if it doesn\'t exist');

  } catch (error) {
    console.error('❌ Error updating IAM permissions:', error.message);
    
    if (error.name === 'AccessDenied') {
      console.error('🚫 Access denied. Make sure your AWS credentials have IAM permissions.');
    } else if (error.name === 'NoSuchEntity') {
      console.error('🚫 Role not found. Make sure the IAM role exists.');
    } else if (error.name === 'EntityAlreadyExists') {
      console.error('🚫 Policy already attached to role.');
    }
    
    process.exit(1);
  }
}

// Run the update
updateIAMPermissions().catch(console.error);
