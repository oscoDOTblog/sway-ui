#!/usr/bin/env node

/**
 * Script to update IAM policy for blog S3 image deletion
 * This adds the necessary DeleteObject permissions to the secure blog S3 policy
 */

import { IAMClient, PutRolePolicyCommand, GetRolePolicyCommand } from '@aws-sdk/client-iam';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// AWS Configuration
const iamClient = new IAMClient({
  region: process.env.AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Configuration
const ROLE_NAME = process.env.AWS_IAM_ROLE_NAME || 'sway-blog-role';
const POLICY_NAME = 'BlogS3SecurePolicy';

async function updateBlogS3Policy() {
  try {
    console.log('🔄 Updating blog S3 policy for image deletion...');
    
    // Read the updated policy file
    const policyPath = join(__dirname, '..', 'infrastructure', 'blog-s3-policy-secure.json');
    const policyContent = readFileSync(policyPath, 'utf8');
    const policy = JSON.parse(policyContent);
    
    console.log('📋 Policy content:');
    console.log(JSON.stringify(policy, null, 2));
    
    // Check if the policy already exists
    try {
      const getCommand = new GetRolePolicyCommand({
        RoleName: ROLE_NAME,
        PolicyName: POLICY_NAME,
      });
      
      const existingPolicy = await iamClient.send(getCommand);
      console.log('ℹ️ Existing policy found, updating...');
    } catch (error) {
      if (error.name === 'NoSuchEntity') {
        console.log('ℹ️ No existing policy found, creating new one...');
      } else {
        throw error;
      }
    }
    
    // Update the policy
    const putCommand = new PutRolePolicyCommand({
      RoleName: ROLE_NAME,
      PolicyName: POLICY_NAME,
      PolicyDocument: JSON.stringify(policy),
    });
    
    await iamClient.send(putCommand);
    
    console.log('✅ Blog S3 policy updated successfully!');
    console.log(`📝 Policy '${POLICY_NAME}' applied to role '${ROLE_NAME}'`);
    console.log('🔒 New permissions include:');
    console.log('   - s3:DeleteObject for blog images (with metadata condition)');
    console.log('   - s3:PutObject for blog images (with security conditions)');
    console.log('   - s3:GetObject for blog images');
    
  } catch (error) {
    console.error('❌ Error updating blog S3 policy:', error);
    
    if (error.name === 'AccessDenied') {
      console.error('🚫 Access denied. Make sure your AWS credentials have IAM permissions.');
    } else if (error.name === 'NoSuchEntity') {
      console.error(`🚫 Role '${ROLE_NAME}' not found. Please create the role first.`);
    }
    
    process.exit(1);
  }
}

// Run the update
updateBlogS3Policy();
