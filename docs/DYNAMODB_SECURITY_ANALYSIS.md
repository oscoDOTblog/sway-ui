# DynamoDB Security Analysis

## Current Policy Comparison

### Existing Blog Policy (`blog-dynamodb-policy.json`)
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem",
                "dynamodb:Query",
                "dynamodb:Scan"
            ],
            "Resource": [
                "arn:aws:dynamodb:us-east-2:435656520815:table/sway-blog-use2",
                "arn:aws:dynamodb:us-east-2:435656520815:table/sway-blog-use2/index/*"
            ]
        }
    ]
}
```

### New Newsletter Policy (`newsletter-dynamodb-policy.json`)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "NewsletterDynamoDBAccess",
      "Effect": "Allow",
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
        "dynamodb:ListTables"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-east-2:*:table/sway-news-use2",
        "arn:aws:dynamodb:us-east-2:*:table/sway-news-use2/index/*"
      ]
    },
    {
      "Sid": "NewsletterDynamoDBListTables",
      "Effect": "Allow",
      "Action": [
        "dynamodb:ListTables"
      ],
      "Resource": "*"
    }
  ]
}
```

## Security Issues Identified

### 🔴 Critical Issues

1. **Account ID Exposure**: Your blog policy exposes your AWS account ID (`435656520815`) in the ARN
   - **Risk**: Account enumeration, potential targeting
   - **Recommendation**: Use `*` instead of specific account ID

2. **Missing Statement IDs (Sid)**: Blog policy lacks descriptive statement IDs
   - **Risk**: Harder to audit and manage
   - **Recommendation**: Add descriptive Sids

### 🟡 Medium Issues

3. **Missing Batch Operations**: Blog policy doesn't include batch operations
   - **Risk**: Inefficient operations, potential performance issues
   - **Recommendation**: Add `BatchGetItem` and `BatchWriteItem`

4. **Missing DescribeTable**: Blog policy doesn't include table description
   - **Risk**: Cannot check table status, harder debugging
   - **Recommendation**: Add `DescribeTable`

### 🟢 Minor Issues

5. **No ListTables Permission**: Blog policy doesn't allow listing tables
   - **Risk**: Cannot discover available tables
   - **Recommendation**: Add `ListTables` with `*` resource

## Recommended Updates

### 1. Update Blog Policy (`blog-dynamodb-policy.json`)

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "BlogDynamoDBAccess",
            "Effect": "Allow",
            "Action": [
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem",
                "dynamodb:Query",
                "dynamodb:Scan",
                "dynamodb:BatchGetItem",
                "dynamodb:BatchWriteItem",
                "dynamodb:DescribeTable"
            ],
            "Resource": [
                "arn:aws:dynamodb:us-east-2:*:table/sway-blog-use2",
                "arn:aws:dynamodb:us-east-2:*:table/sway-blog-use2/index/*"
            ]
        },
        {
            "Sid": "DynamoDBListTables",
            "Effect": "Allow",
            "Action": [
                "dynamodb:ListTables"
            ],
            "Resource": "*"
        }
    ]
}
```

### 2. Update Newsletter Policy (`newsletter-dynamodb-policy.json`)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "NewsletterDynamoDBAccess",
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:BatchGetItem",
        "dynamodb:BatchWriteItem",
        "dynamodb:DescribeTable"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-east-2:*:table/sway-news-use2",
        "arn:aws:dynamodb:us-east-2:*:table/sway-news-use2/index/*"
      ]
    },
    {
      "Sid": "DynamoDBListTables",
      "Effect": "Allow",
      "Action": [
        "dynamodb:ListTables"
      ],
      "Resource": "*"
    }
  ]
}
```

### 3. Use Combined Policy (`combined-dynamodb-policy.json`)

For better management, consider using the combined policy that includes both tables.

## Implementation Steps

### Option 1: Update Existing Policies

1. **Update blog policy**:
   ```bash
   # Create new version of existing policy
   aws iam create-policy-version \
     --policy-arn arn:aws:iam::435656520815:policy/YOUR_BLOG_POLICY_NAME \
     --policy-document file://infrastructure/blog-dynamodb-policy.json \
     --set-as-default
   ```

2. **Create newsletter policy**:
   ```bash
   aws iam create-policy \
     --policy-name SwayNewsletterDynamoDBAccess \
     --policy-document file://infrastructure/newsletter-dynamodb-policy.json \
     --description "DynamoDB access for Sway newsletter subscribers table"
   ```

### Option 2: Replace with Combined Policy

1. **Create combined policy**:
   ```bash
   aws iam create-policy \
     --policy-name SwayDynamoDBAccess \
     --policy-document file://infrastructure/combined-dynamodb-policy.json \
     --description "DynamoDB access for Sway blog and newsletter tables"
   ```

2. **Attach to user**:
   ```bash
   aws iam attach-user-policy \
     --user-name sway-blog \
     --policy-arn arn:aws:iam::435656520815:policy/SwayDynamoDBAccess
   ```

## Security Best Practices Applied

1. ✅ **Principle of Least Privilege**: Only necessary permissions granted
2. ✅ **Resource-Specific Access**: Limited to specific tables and indexes
3. ✅ **Descriptive Statement IDs**: Easy to audit and manage
4. ✅ **Account ID Obfuscation**: Using `*` instead of specific account ID
5. ✅ **Batch Operations**: Efficient bulk operations supported
6. ✅ **Table Discovery**: ListTables permission for debugging

## Monitoring Recommendations

1. **Enable CloudTrail**: Monitor all DynamoDB API calls
2. **Set up CloudWatch Alarms**: Alert on unusual access patterns
3. **Regular Policy Reviews**: Quarterly policy audits
4. **Access Key Rotation**: Rotate keys every 90 days
5. **IAM Access Analyzer**: Use AWS IAM Access Analyzer for policy validation

## Risk Assessment

| Risk Level | Issue | Mitigation |
|------------|-------|------------|
| 🔴 High | Account ID exposure | Use `*` in ARNs |
| 🟡 Medium | Missing batch operations | Add BatchGetItem/BatchWriteItem |
| 🟡 Medium | No table description | Add DescribeTable |
| 🟢 Low | No statement IDs | Add descriptive Sids |
| 🟢 Low | No table listing | Add ListTables |

## Next Steps

1. **Immediate**: Update blog policy to remove account ID exposure
2. **Short-term**: Add missing permissions for better functionality
3. **Long-term**: Consider using IAM roles instead of user policies
4. **Ongoing**: Regular security audits and policy reviews
