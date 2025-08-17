# AI Image Generation for Blog Posts

This document describes the AI-powered image generation system for Sway Quest blog posts.

## Overview

The blog system now automatically generates custom images for each blog post using OpenAI's DALL-E 3 API. Images are generated with an "anime graffiti street style" aesthetic to match the site's branding.

## Features

### 🎨 AI Image Generation
- **OpenAI GPT-4o with Image Generation Tool**: Uses the latest OpenAI API for image generation
- **Custom Prompting**: Automatically prepends "anime graffiti street style" to all prompts
- **Direct Base64 Processing**: No need to download images from URLs
- **Image Optimization**: Resizes and compresses images for web performance
- **S3 Storage**: Uploads images to AWS S3 for reliable hosting

### 🛡️ Graceful Error Handling
- **Fallback Images**: Creates text-based images if AI generation fails
- **OG Image Fallback**: Uses existing OG image generation as final fallback
- **Non-blocking**: Blog posts are created even if image generation fails

### 📱 Mobile Responsive
- **Optimized Sizes**: 1200x630px for featured images, optimized for social sharing
- **Progressive JPEG**: Fast loading with progressive image rendering
- **CDN Ready**: S3-hosted images with proper cache headers

## Technical Implementation

### Image Generation Flow

1. **Blog Topic Analysis**: Extracts the main topic from the blog post
2. **AI Prompt Creation**: Formats topic with "anime graffiti street style" prefix
3. **GPT-4o Image Generation**: Uses OpenAI's image_generation tool to create the image
4. **Base64 Processing**: Converts the returned base64 data to image buffer
5. **Image Optimization**: Resizes and compresses the image for web performance
6. **S3 Upload**: Stores the processed image in the blog images bucket
7. **Fallback Handling**: Creates fallback images if any step fails

### File Structure

```
src/lib/
├── imageService.js          # Main image generation service
└── aws-config.js           # Updated with S3 configuration

infrastructure/
├── blog-s3-policy.json     # IAM policy for S3 access
└── combined-dynamodb-policy.json # Updated with S3 permissions

scripts/
├── update-iam-s3-permissions.js # IAM policy update script
└── test-image-generation.js     # Image generation test script
```

## Setup Instructions

### 1. Environment Variables

Add these to your `.env.local` file:

```bash
# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here

# AWS S3
AWS_S3_BLOG=sway-public-use2
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_IAM_ROLE_NAME=sway-quest-role
AWS_ACCOUNT_ID=435656520815
```

### 2. Install Dependencies

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner sharp @aws-sdk/client-iam
```

### 3. Create S3 Bucket

Create an S3 bucket named `sway-public-use2` (or update `AWS_S3_BLOG` env var):

```bash
aws s3 mb s3://sway-public-use2 --region us-east-1
```

### 4. Update IAM Permissions

Run the IAM update script to add S3 permissions:

```bash
npm run update:iam-s3
```

### 5. Test Image Generation

Test the image generation functionality:

```bash
npm run test:image-generation
```

## Usage

### Automatic Generation

Images are automatically generated when creating blog posts via:

- **Admin Interface**: `/admin/blog-generator`
- **API Endpoint**: `POST /api/blog/generate`
- **Automated Cron Jobs**: Daily blog generation

### Manual Testing

Test image generation with a specific topic:

```bash
curl -X POST http://localhost:3000/api/blog/generate \
  -H "Content-Type: application/json" \
  -H "x-admin-password: admin-authenticated" \
  -d '{"topic": "How to Master Dance Moves", "count": 1}'
```

## Image Specifications

### Generated Images
- **Size**: 1200x630px (16:9 aspect ratio)
- **Format**: JPEG with 85% quality
- **Optimization**: Progressive JPEG with mozjpeg compression
- **File Size**: Typically 50-200KB

### Fallback Images
- **Style**: Text overlay on gradient background
- **Colors**: Hot pink (#ff0080) and white text on dark gradient
- **Branding**: Includes "sway.quest" watermark

## Error Handling

### Common Issues

1. **OpenAI Quota Exceeded**
   - System falls back to text-based image generation
   - Blog post creation continues normally

2. **S3 Bucket Not Found**
   - Check bucket name in environment variables
   - Ensure bucket exists in the correct region

3. **IAM Permissions**
   - Run `npm run update:iam-s3` to update permissions
   - Verify role has S3 PutObject, GetObject, DeleteObject permissions

4. **Network Issues**
   - Image generation fails gracefully
   - Blog posts are created with OG images instead

### Debugging

Check logs for specific error messages:

```bash
# Development server logs
npm run dev

# Test specific functionality
npm run test:image-generation
```

## Cost Considerations

### OpenAI API Costs
- **GPT-4o with Image Generation**: ~$0.04 per image (1024x1024)
- **Estimated Monthly**: $1-5 for typical blog volume

### AWS S3 Costs
- **Storage**: ~$0.023 per GB per month
- **Requests**: ~$0.0004 per 1,000 GET requests
- **Estimated Monthly**: <$1 for typical usage

## Security

### Data Protection
- **No Sensitive Data**: Images contain no personal or sensitive information
- **Public Access**: Images are publicly accessible for blog display
- **Metadata**: Includes generation timestamp and blog slug for tracking

### Access Control
- **IAM Policies**: Least privilege access to S3 bucket
- **API Keys**: OpenAI API key stored securely in environment variables
- **Error Logging**: No sensitive data in error messages

## Future Enhancements

### Planned Features
- **Image Caching**: Cache generated images to reduce API calls
- **Style Variations**: Multiple artistic styles based on blog category
- **Batch Processing**: Generate multiple image variations
- **Image Analytics**: Track image performance and engagement

### Optimization Opportunities
- **WebP Format**: Convert to WebP for better compression
- **Responsive Images**: Generate multiple sizes for different devices
- **Lazy Loading**: Implement lazy loading for better performance
- **CDN Integration**: Use CloudFront for global image delivery
