# Blog Image Deletion System

## Overview

The blog system now includes automatic S3 image deletion when blog posts are deleted. This ensures that associated images are cleaned up from storage before the database record is removed, preventing orphaned files and maintaining storage efficiency.

## Key Features

- **Fail-Safe Deletion**: If S3 image deletion fails, the entire deletion process is aborted and the database record is preserved
- **Multiple Image Support**: Handles `featuredImage`, `image`, and `thumbnail` fields
- **Secure IAM Policy**: Uses conditional permissions to ensure only blog images can be deleted
- **Comprehensive Error Handling**: Detailed logging and error reporting for troubleshooting
- **Loading Animation**: Visual feedback during deletion process with spinning animations and loading states

## Implementation Details

### API Changes

The blog deletion API (`/api/blog/[slug]`) now:

1. Retrieves the blog post data to get image URLs
2. Attempts to delete all associated S3 images
3. Only proceeds with database deletion if S3 deletion succeeds
4. Returns detailed error messages if S3 deletion fails

### Image Service Functions

#### `deleteBlogImage(imageUrl)`
Deletes a single image from S3.

**Parameters:**
- `imageUrl` (string): The S3 URL of the image to delete

**Returns:**
- `Promise<boolean>`: `true` if deleted successfully, `false` if no image to delete

**Throws:**
- `Error`: If S3 deletion fails

#### `deleteBlogImages(blogPost)`
Deletes all images associated with a blog post.

**Parameters:**
- `blogPost` (Object): The blog post object containing image URLs

**Returns:**
- `Promise<boolean>`: `true` if all deletions successful or no images to delete

**Throws:**
- `Error`: If any S3 deletion fails

### Supported Image Fields

The system automatically checks and deletes images from these fields:
- `featuredImage` - Main blog post image
- `image` - Additional blog post image
- `thumbnail` - Blog post thumbnail

### Loading Animation Features

The blog deletion process includes comprehensive loading animations:

#### Visual Feedback
- **Delete Button**: Spinning animation with the trash icon
- **Row State**: Subtle opacity reduction and background highlighting
- **Loading Text**: "🗑️ Deleting post and cleaning up images..." message
- **Button Disabled**: Prevents multiple deletion attempts

#### Animation Details
- **Spinning Animation**: 360-degree rotation with scale effect
- **Pulse Animation**: Subtle opacity and scale pulsing
- **Row Highlighting**: Gradient background animation
- **Smooth Transitions**: All animations use CSS transitions for smooth UX

#### User Experience
- **Immediate Feedback**: Loading state appears instantly on delete click
- **Clear Status**: Users know exactly what's happening during deletion
- **Prevents Confusion**: Disabled state prevents accidental multiple clicks
- **Professional Look**: Netflix-style animations with hot pink accents

### S3 URL Formats Supported

- Standard S3 URLs: `https://bucket-name.s3.amazonaws.com/path/to/image.jpg`
- Custom S3 bucket URLs: `https://sway-public-use2.s3.amazonaws.com/blog/image.jpg`

## Security Considerations

### IAM Policy Updates

The secure S3 policy (`blog-s3-policy-secure.json`) has been updated to include:

```json
{
    "Sid": "BlogS3ImageDelete",
    "Effect": "Allow",
    "Action": [
        "s3:DeleteObject"
    ],
    "Resource": [
        "arn:aws:s3:::sway-public-use2/blog/*"
    ],
    "Condition": {
        "StringLike": {
            "s3:x-amz-meta-blog-slug": "*"
        }
    }
}
```

**Security Features:**
- **Conditional Access**: Only allows deletion of objects with blog metadata
- **Path Restriction**: Limited to `/blog/*` path in the S3 bucket
- **Metadata Validation**: Requires `blog-slug` metadata to be present

### Error Handling

The system provides comprehensive error handling:

- **NoSuchKey**: Image not found (logged but doesn't fail the process)
- **AccessDenied**: Permission issues (fails the entire deletion)
- **NoSuchBucket**: Bucket doesn't exist (fails the entire deletion)
- **Network Errors**: Connection issues (fails the entire deletion)

## Usage

### Automatic Deletion

Image deletion happens automatically when deleting a blog post through the admin interface or API:

```javascript
// This will automatically delete S3 images before database deletion
await fetch(`/api/blog/${slug}`, {
  method: 'DELETE',
  headers: {
    'x-admin-password': 'admin-authenticated',
  },
});
```

### Manual Testing

Use the test scripts to verify functionality:

```bash
# Test S3 image deletion functions
node scripts/test-blog-image-deletion.js

# Test complete blog deletion API flow
node scripts/test-blog-deletion-api.js

# Test loading animation during deletion
node scripts/test-blog-deletion-loading.js
```

### Policy Updates

Update IAM permissions using the provided script:

```bash
node scripts/update-blog-s3-delete-policy.js
```

## Error Responses

### Successful Deletion
```json
{
  "success": true,
  "message": "Blog post and associated images deleted successfully"
}
```

### S3 Deletion Failure
```json
{
  "success": false,
  "error": "Failed to delete associated images from storage. Blog post was not deleted.",
  "details": "Failed to delete blog image from S3: AccessDenied"
}
```

## Monitoring and Logging

The system provides detailed logging for monitoring:

- **Deletion Start**: Logs when deletion process begins
- **Image Processing**: Logs each image being processed
- **S3 Operations**: Logs S3 deletion attempts and results
- **Error Details**: Comprehensive error logging with specific S3 error types
- **Success Confirmation**: Logs successful completion of all operations

## Troubleshooting

### Common Issues

1. **Access Denied Errors**
   - Verify IAM policy is updated with DeleteObject permissions
   - Check that the role has the correct permissions attached
   - Ensure the S3 bucket path matches the policy

2. **Image Not Found Errors**
   - These are expected for non-existent images
   - The process continues normally in these cases

3. **Network Errors**
   - Check AWS credentials and region configuration
   - Verify S3 bucket exists and is accessible

### Debug Steps

1. Run the test script to verify functionality
2. Check CloudWatch logs for detailed error messages
3. Verify IAM policy is correctly applied
4. Test with a known existing image URL

## Future Enhancements

- **Batch Deletion**: Support for deleting multiple blog posts with image cleanup
- **Image Validation**: Verify image exists before attempting deletion
- **Retry Logic**: Implement retry mechanism for transient S3 errors
- **Metrics**: Add CloudWatch metrics for deletion success/failure rates
