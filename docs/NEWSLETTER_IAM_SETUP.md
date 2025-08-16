# Newsletter DynamoDB IAM Setup

This document explains how to set up IAM permissions for the newsletter DynamoDB table.

## Policy Overview

The `SwayNewsletterDynamoDBAccess` policy provides the following permissions:

- **Read Operations**: `GetItem`, `Query`, `Scan`, `DescribeTable`
- **Write Operations**: `PutItem`, `UpdateItem`, `DeleteItem`, `BatchWriteItem`
- **Batch Operations**: `BatchGetItem`, `BatchWriteItem`
- **Table Management**: `ListTables`

## Policy Resources

The policy grants access to:
- `arn:aws:dynamodb:us-east-2:*:table/sway-news-use2`
- `arn:aws:dynamodb:us-east-2:*:table/sway-news-use2/index/*`

## Setup Methods

### Method 1: AWS CLI (Recommended)

1. **Create the policy**:
   ```bash
   aws iam create-policy \
     --policy-name SwayNewsletterDynamoDBAccess \
     --policy-document file://infrastructure/newsletter-dynamodb-policy.json \
     --description "DynamoDB access for Sway newsletter subscribers table"
   ```

2. **Attach to user**:
   ```bash
   aws iam attach-user-policy \
     --user-name sway-blog \
     --policy-arn arn:aws:iam::YOUR_ACCOUNT_ID:policy/SwayNewsletterDynamoDBAccess
   ```

3. **Verify attachment**:
   ```bash
   aws iam list-attached-user-policies --user-name sway-blog
   ```

### Method 2: AWS Console

1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Navigate to **Policies** > **Create Policy**
3. Choose **JSON** tab
4. Paste the policy document from `infrastructure/newsletter-dynamodb-policy.json`
5. Click **Next: Tags** (optional)
6. Click **Next: Review**
7. Name: `SwayNewsletterDynamoDBAccess`
8. Description: `DynamoDB access for Sway newsletter subscribers table`
9. Click **Create Policy**
10. Go to **Users** > **sway-blog** > **Add permissions** > **Attach policies directly**
11. Search for and select `SwayNewsletterDynamoDBAccess`
12. Click **Add permissions**

## Testing the Setup

After creating the policy, test the setup:

```bash
# Test DynamoDB connection
npm run test:dynamodb

# Test newsletter service
npm run test:newsletter

# Test full newsletter functionality
npm run test:newsletter-service
```

## Updating the Policy

To modify the policy:

1. **Edit the policy document**:
   ```bash
   nano infrastructure/newsletter-dynamodb-policy.json
   ```

2. **Update the policy**:
   ```bash
   aws iam create-policy-version \
     --policy-arn arn:aws:iam::YOUR_ACCOUNT_ID:policy/SwayNewsletterDynamoDBAccess \
     --policy-document file://infrastructure/newsletter-dynamodb-policy.json \
     --set-as-default
   ```

3. **Or use the console**:
   - Go to IAM > Policies > SwayNewsletterDynamoDBAccess
   - Click **Edit policy**
   - Make changes and save

## Policy Customization

### Adding More Tables

To add access to additional DynamoDB tables, add them to the `Resource` array:

```json
"Resource": [
  "arn:aws:dynamodb:us-east-2:*:table/sway-news-use2",
  "arn:aws:dynamodb:us-east-2:*:table/sway-news-use2/index/*",
  "arn:aws:dynamodb:us-east-2:*:table/your-new-table",
  "arn:aws:dynamodb:us-east-2:*:table/your-new-table/index/*"
]
```

### Adding More Permissions

To add additional DynamoDB permissions, add them to the `Action` array:

```json
"Action": [
  "dynamodb:GetItem",
  "dynamodb:PutItem",
  "dynamodb:UpdateItem",
  "dynamodb:DeleteItem",
  "dynamodb:Query",
  "dynamodb:Scan",
  "dynamodb:BatchGetItem",
  "dynamodb:BatchWriteItem",
  "dynamodb:DescribeTable",
  "dynamodb:ListTables",
  "dynamodb:CreateTable",  // New permission
  "dynamodb:DeleteTable"   // New permission
]
```

### Changing Regions

To use a different AWS region, update the ARN pattern:

```json
"Resource": [
  "arn:aws:dynamodb:us-west-2:*:table/sway-news-use2",  // Changed region
  "arn:aws:dynamodb:us-west-2:*:table/sway-news-use2/index/*"
]
```

## Troubleshooting

### Common Issues

1. **Access Denied**: Wait 5-10 minutes for permissions to propagate
2. **Policy Not Found**: Ensure the policy name matches exactly
3. **User Not Found**: Verify the user name is correct
4. **Region Mismatch**: Ensure the region in the policy matches your table

### Debug Commands

```bash
# Check if policy exists
aws iam get-policy --policy-arn arn:aws:iam::YOUR_ACCOUNT_ID:policy/SwayNewsletterDynamoDBAccess

# Check user's attached policies
aws iam list-attached-user-policies --user-name sway-blog

# Test DynamoDB access
aws dynamodb list-tables --region us-east-2

# Describe the table
aws dynamodb describe-table --table-name sway-news-use2 --region us-east-2
```

## Security Best Practices

1. **Principle of Least Privilege**: Only grant necessary permissions
2. **Regular Review**: Periodically review and update policies
3. **Use IAM Roles**: Consider using IAM roles instead of user policies for applications
4. **Monitor Access**: Enable CloudTrail to monitor API calls
5. **Rotate Credentials**: Regularly rotate access keys

## Related Files

- `infrastructure/newsletter-dynamodb-policy.json` - Policy document
- `scripts/create-newsletter-policy.js` - Policy creation helper
- `src/lib/newsletterService.js` - Service using these permissions
- `docs/NEWSLETTER_DYNAMODB_SETUP.md` - Complete DynamoDB setup guide
