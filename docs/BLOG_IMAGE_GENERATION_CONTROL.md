# Blog Image Generation Control

This document describes how to control AI image generation during blog post creation using the `APP_BLOG_GEN_IMAGE` environment variable.

## Overview

The blog system automatically generates AI-powered images for each blog post using OpenAI's DALL-E 3 API. However, you can disable this feature to save costs or reduce API usage by setting an environment variable.

## Environment Variable

### `APP_BLOG_GEN_IMAGE`

**Type:** String  
**Values:** `true`, `false`, or not set  
**Default:** `true` (image generation enabled)

### Usage

#### Enable Image Generation (Default)
```bash
# Set explicitly to true
APP_BLOG_GEN_IMAGE=true

# Or simply don't set the variable (defaults to enabled)
```

#### Disable Image Generation
```bash
APP_BLOG_GEN_IMAGE=false
```

## Behavior

### When `APP_BLOG_GEN_IMAGE=false`:

1. **Blog Post Generation**: AI image generation is skipped during blog post creation
2. **Fallback Images**: Blog posts will use OG image generation as fallback
3. **Image Regeneration API**: Manual image regeneration is blocked with a 403 error
4. **Logging**: Console logs will show "🖼️ Image generation disabled via APP_BLOG_GEN_IMAGE=false"

### When `APP_BLOG_GEN_IMAGE=true` or not set:

1. **Blog Post Generation**: AI images are generated normally
2. **Fallback Handling**: If AI generation fails, falls back to OG images
3. **Image Regeneration API**: Works normally for admin users

## Implementation Details

### Affected Endpoints

- `POST /api/blog/generate` - Blog post generation (both manual and automated)
- `POST /api/blog/regenerate-image` - Manual image regeneration

### Code Changes

The environment variable check is implemented in:

1. **Blog Generation Route** (`src/app/api/blog/generate/route.js`):
   ```javascript
   const imageGenerationEnabled = process.env.APP_BLOG_GEN_IMAGE !== 'false';
   
   if (imageGenerationEnabled) {
     // Generate AI image
   } else {
     console.log('🖼️ Image generation disabled via APP_BLOG_GEN_IMAGE=false');
   }
   ```

2. **Image Regeneration Route** (`src/app/api/blog/regenerate-image/route.js`):
   ```javascript
   if (process.env.APP_BLOG_GEN_IMAGE === 'false') {
     return NextResponse.json({ 
       success: false, 
       error: 'Image generation is disabled via APP_BLOG_GEN_IMAGE=false environment variable' 
     }, { status: 403 });
   }
   ```

## Testing

Use the provided test script to verify the functionality:

```bash
node scripts/test-blog-gen-image-env.js
```

This script tests:
1. Blog generation with `APP_BLOG_GEN_IMAGE=false`
2. Blog generation with `APP_BLOG_GEN_IMAGE` not set
3. Image regeneration API with `APP_BLOG_GEN_IMAGE=false`

## Use Cases

### Cost Optimization
- Disable image generation during development/testing
- Reduce OpenAI API costs in non-production environments
- Control image generation during high-traffic periods

### Performance
- Faster blog post generation (no image generation delay)
- Reduced API dependencies
- Simplified deployment in restricted environments

### Compliance
- Meet data processing requirements
- Control external API usage
- Maintain audit trails

## Migration

### From Previous Version
No migration required. The feature is backward compatible:
- Existing deployments without the variable will continue to generate images
- Set `APP_BLOG_GEN_IMAGE=false` to disable image generation

### Environment Setup
Add to your `.env` file:
```bash
# Enable image generation (default)
APP_BLOG_GEN_IMAGE=true

# Or disable image generation
APP_BLOG_GEN_IMAGE=false
```

## Monitoring

### Logs to Watch
- `🖼️ Image generation disabled via APP_BLOG_GEN_IMAGE=false` - Confirms feature is disabled
- `🎨 Generating AI image...` - Confirms feature is enabled
- `⚠️ AI image generation failed, trying fallback image...` - Normal fallback behavior

### Metrics
- Blog post generation time (faster when images disabled)
- OpenAI API usage (reduced when images disabled)
- S3 storage usage (reduced when images disabled)

## Troubleshooting

### Image Generation Still Happening
1. Check environment variable spelling: `APP_BLOG_GEN_IMAGE=false`
2. Restart the application after changing the variable
3. Verify the variable is loaded in your environment

### Image Regeneration API Blocked
This is expected behavior when `APP_BLOG_GEN_IMAGE=false`. The API returns a 403 error with a clear message.

### Fallback Images Not Working
The system falls back to OG image generation when AI images are disabled. Ensure your OG image endpoint is working correctly.
