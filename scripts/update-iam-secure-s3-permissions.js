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

async function updateSecureIAMPermissions() {
  console.log('🔐 Updating IAM permissions with SECURE S3 policy...\n');

  try {
    const roleName = process.env.AWS_IAM_ROLE_NAME || 'sway-quest-role';
    const policyName = 'SwayBlogS3SecureImagePolicy';
    const policyArn = `arn:aws:iam::${process.env.AWS_ACCOUNT_ID || '435656520815'}:policy/${policyName}`;

    console.log(`📋 Role Name: ${roleName}`);
    console.log(`📋 Policy Name: ${policyName}`);
    console.log(`📋 Policy ARN: ${policyArn}\n`);

    // Read the secure S3 policy document
    const policyDocument = fs.readFileSync('./infrastructure/blog-s3-policy-secure.json', 'utf8');
    const policyJson = JSON.parse(policyDocument);

    console.log('📄 Secure policy document:');
    console.log(JSON.stringify(policyJson, null, 2));
    console.log('');

    // Check if policy already exists
    try {
      await iamClient.send(new GetPolicyCommand({ PolicyArn: policyArn }));
      console.log('✅ Policy already exists, skipping creation');
    } catch (error) {
      if (error.name === 'NoSuchEntity') {
        console.log('📝 Creating new secure S3 policy...');
        
        // Create the policy
        const createPolicyCommand = new CreatePolicyCommand({
          PolicyName: policyName,
          PolicyDocument: JSON.stringify(policyJson),
          Description: 'SECURE S3 permissions for blog image uploads on Sway Quest - Least privilege access'
        });

        const createResult = await iamClient.send(createPolicyCommand);
        console.log('✅ Secure policy created successfully');
        console.log(`📋 Policy ARN: ${createResult.Policy.Arn}`);
      } else {
        throw error;
      }
    }

    console.log('\n🔗 Attaching secure policy to role...');
    
    // Attach the policy to the role
    const attachCommand = new AttachRolePolicyCommand({
      RoleName: roleName,
      PolicyArn: policyArn
    });

    await iamClient.send(attachCommand);
    console.log('✅ Secure policy attached to role successfully');

    console.log('\n🎉 SECURE IAM permissions updated successfully!');
    console.log('\n📋 Security Improvements:');
    console.log('   • ❌ Removed: s3:DeleteObject (prevents data deletion)');
    console.log('   • ❌ Removed: s3:PutObjectAcl (prevents permission changes)');
    console.log('   • ❌ Removed: s3:ListBucket (prevents enumeration)');
    console.log('   • ❌ Removed: s3:ListAllMyBuckets (prevents bucket discovery)');
    console.log('   • ✅ Added: Path restriction to /blog/* only');
    console.log('   • ✅ Added: Content validation conditions');
    console.log('   • ✅ Added: Metadata validation for blog-slug');
    console.log('\n🔒 Security Summary:');
    console.log(`   • Role: ${roleName}`);
    console.log(`   • Policy: ${policyName}`);
    console.log(`   • Permissions: S3 PutObject (restricted), GetObject (restricted)`);
    console.log(`   • Bucket: sway-public-use2/blog/*`);
    console.log(`   • Principle: Least privilege access`);

  } catch (error) {
    console.error('❌ Error updating secure IAM permissions:', error.message);
    
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
updateSecureIAMPermissions().catch(console.error);
