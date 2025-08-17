# Newsletter DynamoDB Setup

This document outlines the setup and migration process for moving newsletter subscribers from Supabase to AWS DynamoDB.

## Table Design

### Table Name: `sway-news-use2`

### Primary Key Strategy
- **Partition Key (PK)**: `email` (String) - Email address of the subscriber
- **Sort Key (SK)**: `subscriberId` (String) - Unique identifier for each subscription

### Schema Fields

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `email` | String | Email address (partition key) | ✅ |
| `subscriberId` | String | Unique subscriber ID (sort key) | ✅ |
| `firstName` | String | First name | ❌ |
| `lastName` | String | Last name | ❌ |
| `subscribedAt` | String | ISO timestamp of subscription | ✅ |
| `source` | String | Source of subscription (e.g., 'sway-ui') | ✅ |
| `status` | String | Subscription status ('active', 'unsubscribed', 'bounced') | ✅ |
| `emailCount` | Number | Number of emails sent to this subscriber | ✅ |
| `openRate` | Number | Email open rate percentage | ✅ |
| `clickRate` | Number | Email click rate percentage | ✅ |
| `lastEmailSent` | String | ISO timestamp of last email sent | ❌ |
| `createdAt` | String | Record creation timestamp | ✅ |
| `updatedAt` | String | Last update timestamp | ✅ |
| `tags` | Array | Tags for segmentation | ✅ |
| `preferences` | Object | User preferences | ✅ |

### Global Secondary Indexes

1. **StatusIndex**
   - Partition Key: `status`
   - Sort Key: `subscribedAt`
   - Purpose: Query subscribers by status and date

2. **SourceIndex**
   - Partition Key: `source`
   - Sort Key: `subscribedAt`
   - Purpose: Query subscribers by source and date

## Setup Instructions

### 1. Create DynamoDB Table

Deploy the CloudFormation template:

```bash
aws cloudformation deploy \
  --template-file infrastructure/newsletter-table.yaml \
  --stack-name sway-newsletter-subscribers \
  --parameter-overrides Environment=production \
  --capabilities CAPABILITY_NAMED_IAM
```

### 2. Environment Variables

Add these to your `.env.local`:

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# DynamoDB Table
AWS_DYNAMODB_NEWS=sway-news-use2
```

### 3. Install Dependencies

```bash
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb uuid
```

### 4. Migrate Data from Supabase

Run the migration script:

```bash
# Full migration with verification
node scripts/migrate-newsletter-to-dynamodb.js full

# Or run steps separately
node scripts/migrate-newsletter-to-dynamodb.js migrate
node scripts/migrate-newsletter-to-dynamodb.js verify
```

### 5. Test the Setup

```bash
node scripts/test-newsletter-dynamodb.js
```

## Usage Examples

### Adding a New Subscriber

```javascript
import { addSubscriber } from '../src/lib/newsletterService.js';

const result = await addSubscriber({
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  source: 'sway-ui',
  tags: ['dance', 'newsletter'],
  preferences: {
    frequency: 'weekly',
    categories: ['dance', 'music']
  }
});

if (result.success) {
  console.log('Subscriber added successfully');
} else {
  console.log('Email already subscribed');
}
```

### Getting Active Subscribers for Campaign

```javascript
import { getCampaignSubscribers } from '../src/lib/newsletterService.js';

const subscribers = await getCampaignSubscribers({
  tags: ['dance'],
  source: 'sway-ui',
  limit: 1000
});

console.log(`Found ${subscribers.length} subscribers for campaign`);
```

### Updating Email Statistics

```javascript
import { updateEmailStats } from '../src/lib/newsletterService.js';

await updateEmailStats('user@example.com', {
  emailCount: 5,
  openRate: 0.75,
  clickRate: 0.25
});
```

### Unsubscribing a User

```javascript
import { unsubscribeSubscriber } from '../src/lib/newsletterService.js';

await unsubscribeSubscriber('user@example.com');
```

## API Integration

### Update Newsletter Signup API

Replace the Supabase logic in `/api/newsletter-signup/route.js`:

```javascript
import { addSubscriber } from '../../lib/newsletterService.js';

// Replace Supabase insert with:
const result = await addSubscriber({
  email: email,
  source: 'sway-ui'
});

if (result.success) {
  // Success response
} else {
  // Handle duplicate email
}
```

## Benefits of This Design

1. **Scalability**: DynamoDB can handle millions of subscribers efficiently
2. **Cost-Effective**: Pay-per-request billing for variable workloads
3. **High Availability**: 99.99% uptime SLA
4. **Flexible Querying**: Multiple indexes for different access patterns
5. **Email Campaign Ready**: Built-in fields for tracking email performance
6. **GDPR Compliant**: Easy deletion and data export capabilities

## Monitoring and Analytics

### Key Metrics to Track

- Total subscriber count
- Growth rate (new subscriptions per day/week)
- Unsubscribe rate
- Email engagement rates (open/click)
- Source distribution

### CloudWatch Alarms

Set up alarms for:
- High error rates in DynamoDB operations
- Unusual subscription patterns
- Failed email deliveries

## Security Considerations

1. **IAM Roles**: Use least-privilege access
2. **Encryption**: SSE-S3 encryption enabled by default
3. **Backup**: Point-in-time recovery enabled
4. **Audit**: Enable CloudTrail for API calls

## Cost Optimization

1. **On-Demand Billing**: Suitable for variable workloads
2. **Provisioned Capacity**: Consider for predictable high-volume workloads
3. **TTL**: Set TTL for unsubscribed users after compliance period
4. **Index Optimization**: Only create necessary GSI

## Migration Checklist

- [ ] Deploy CloudFormation template
- [ ] Set up environment variables
- [ ] Install dependencies
- [ ] Run migration script
- [ ] Verify data integrity
- [ ] Test service functions
- [ ] Update API endpoints
- [ ] Monitor for errors
- [ ] Set up CloudWatch alarms
- [ ] Document team procedures

## Troubleshooting

### Common Issues

1. **Access Denied**: Check IAM permissions
2. **Table Not Found**: Verify table name and region
3. **Migration Failures**: Check Supabase connection and credentials
4. **High Latency**: Consider using DynamoDB Accelerator (DAX)

### Debug Commands

```bash
# Check table status
aws dynamodb describe-table --table-name sway-news-use2

# Count items
aws dynamodb scan --table-name sway-news-use2 --select COUNT

# Check CloudWatch logs
aws logs describe-log-groups --log-group-name-prefix /aws/lambda
```
