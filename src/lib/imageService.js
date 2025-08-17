import OpenAI from 'openai';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, BLOG_IMAGES_BUCKET } from './aws-config';
import sharp from 'sharp';

// Initialize OpenAI
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

/**
 * Generate an image using OpenAI's newer API with image_generation tool
 * @param {string} topic - The blog topic to generate image for
 * @param {string} slug - The blog post slug for filename
 * @returns {Promise<string|null>} - S3 URL of the generated image or null if failed
 */
export async function generateBlogImage(topic, slug) {
  try {
    console.log(`🎨 Generating image for topic: ${topic}`);
    
    // Create the prompt with anime graffiti street style prefix
    const imagePrompt = `anime graffiti street style, ${topic}, vibrant colors, dynamic composition, high quality, detailed`;
    
    // Generate image using OpenAI's newer API with image_generation tool
    const response = await openai.responses.create({
      model: "gpt-5",
      input: imagePrompt,
      tools: [{ type: "image_generation" }],
    });

    // Extract image data from the response
    const imageData = response.output
      .filter((output) => output.type === "image_generation_call")
      .map((output) => output.result);

    if (!imageData || imageData.length === 0) {
      console.error('❌ No image data returned from OpenAI');
      return null;
    }

    const imageBase64 = imageData[0];
    console.log(`✅ Image generated successfully with new API`);

    // Convert base64 to buffer and process the image
    const imageBuffer = Buffer.from(imageBase64, 'base64');
    const processedImageBuffer = await processAndOptimizeImage(imageBuffer);
    
    if (!processedImageBuffer) {
      console.error('❌ Failed to process image');
      return null;
    }

    // Upload to S3
    const s3Url = await uploadImageToS3(processedImageBuffer, slug);
    
    if (s3Url) {
      console.log(`✅ Image uploaded to S3: ${s3Url}`);
      return s3Url;
    } else {
      console.error('❌ Failed to upload image to S3');
      return null;
    }

  } catch (error) {
    console.error('❌ Error generating blog image:', error.message);
    
    // Log specific error types for debugging
    if (error.code === 'insufficient_quota') {
      console.error('💰 OpenAI API quota exceeded');
    } else if (error.code === 'content_policy_violation') {
      console.error('🚫 Content policy violation - prompt may be inappropriate');
    } else if (error.code === 'rate_limit_exceeded') {
      console.error('⏱️ Rate limit exceeded - too many requests');
    }
    
    return null;
  }
}

/**
 * Process and optimize the generated image
 * @param {Buffer} imageBuffer - The raw image buffer from OpenAI
 * @returns {Promise<Buffer|null>} - Processed image buffer or null if failed
 */
async function processAndOptimizeImage(imageBuffer) {
  try {
    console.log('🔧 Processing and optimizing image...');
    
    // Process image with Sharp for optimization
    const processedBuffer = await sharp(imageBuffer)
      .resize(1200, 630, { 
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ 
        quality: 85,
        progressive: true,
        mozjpeg: true
      })
      .toBuffer();
    
    console.log(`✅ Image processed: ${imageBuffer.length} -> ${processedBuffer.length} bytes`);
    return processedBuffer;
    
  } catch (error) {
    console.error('❌ Error processing image:', error.message);
    return null;
  }
}

/**
 * Upload processed image to S3
 * @param {Buffer} imageBuffer - The processed image buffer
 * @param {string} slug - Blog post slug for filename
 * @returns {Promise<string|null>} - S3 URL or null if failed
 */
async function uploadImageToS3(imageBuffer, slug) {
  try {
    console.log('☁️ Uploading image to S3...');
    
    // Create filename with timestamp to ensure uniqueness
    // Note: Must be in blog/ path to match secure IAM policy
    const timestamp = Date.now();
    const filename = `blog/${slug}-${timestamp}.jpg`;
    
    // Upload to S3
    const uploadCommand = new PutObjectCommand({
      Bucket: BLOG_IMAGES_BUCKET,
      Key: filename,
      Body: imageBuffer,
      ContentType: 'image/jpeg',
      CacheControl: 'public, max-age=31536000', // 1 year cache
      Metadata: {
        'generated-by': 'openai-image-generation-tool',
        'blog-slug': slug,
        'generated-at': new Date().toISOString()
      }
    });
    
    await s3Client.send(uploadCommand);
    
    // Return the public S3 URL
    const s3Url = `https://${BLOG_IMAGES_BUCKET}.s3.amazonaws.com/${filename}`;
    return s3Url;
    
  } catch (error) {
    console.error('❌ Error uploading to S3:', error.message);
    
    // Log specific S3 errors
    if (error.name === 'NoSuchBucket') {
      console.error('🪣 S3 bucket does not exist:', BLOG_IMAGES_BUCKET);
    } else if (error.name === 'AccessDenied') {
      console.error('🚫 Access denied to S3 bucket');
    }
    
    return null;
  }
}

/**
 * Generate a fallback image using text overlay
 * @param {string} title - Blog post title
 * @param {string} slug - Blog post slug
 * @returns {Promise<string|null>} - S3 URL of fallback image or null if failed
 */
export async function generateFallbackImage(title, slug) {
  try {
    console.log('🎨 Generating fallback image...');
    
    // Create a simple text-based image
    const width = 1200;
    const height = 630;
    
    // Create SVG with hot pink theme
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0a0a0a;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
        <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="48" font-weight="bold" 
              text-anchor="middle" fill="#ff0080">${title}</text>
        <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="24" 
              text-anchor="middle" fill="#ffffff">sway.quest</text>
      </svg>
    `;
    
    // Convert SVG to buffer
    const svgBuffer = Buffer.from(svg);
    
    // Convert to JPEG using Sharp
    const imageBuffer = await sharp(svgBuffer)
      .jpeg({ 
        quality: 90,
        progressive: true
      })
      .toBuffer();
    
    // Upload to S3
    const s3Url = await uploadImageToS3(imageBuffer, `${slug}-fallback`);
    
    if (s3Url) {
      console.log(`✅ Fallback image created: ${s3Url}`);
      return s3Url;
    } else {
      console.error('❌ Failed to create fallback image');
      return null;
    }
    
  } catch (error) {
    console.error('❌ Error generating fallback image:', error.message);
    return null;
  }
}

/**
 * Delete blog image from S3
 * @param {string} imageUrl - The S3 URL of the image to delete
 * @returns {Promise<boolean>} - true if deleted successfully, false if no image to delete
 * @throws {Error} - if S3 deletion fails
 */
export async function deleteBlogImage(imageUrl) {
  try {
    if (!imageUrl) {
      console.log('ℹ️ No image URL provided for deletion');
      return false;
    }

    // Handle S3 URLs
    if (imageUrl.includes('s3.amazonaws.com')) {
      // Extract bucket and key from S3 URL
      const url = new URL(imageUrl);
      const hostname = url.hostname;
      
      // Parse bucket name from hostname (e.g., "sway-public-use2.s3.amazonaws.com")
      const bucketName = hostname.split('.')[0];
      const key = url.pathname.substring(1); // Remove leading slash

      console.log(`🗑️ Deleting blog image from S3: ${bucketName}/${key}`);

      const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      });

      await s3Client.send(deleteCommand);
      console.log(`✅ Blog image deleted from S3 successfully: ${key}`);
      return true;
    }

    // Handle custom S3 bucket URLs
    if (imageUrl.includes(BLOG_IMAGES_BUCKET)) {
      // Extract key from URL
      const url = new URL(imageUrl);
      const key = url.pathname.substring(1); // Remove leading slash

      console.log(`🗑️ Deleting blog image from custom S3: ${BLOG_IMAGES_BUCKET}/${key}`);

      const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
      const deleteCommand = new DeleteObjectCommand({
        Bucket: BLOG_IMAGES_BUCKET,
        Key: key,
      });

      await s3Client.send(deleteCommand);
      console.log(`✅ Blog image deleted from custom S3 successfully: ${key}`);
      return true;
    }

    console.log(`ℹ️ Unknown storage URL format for blog image: ${imageUrl}`);
    return false;
  } catch (error) {
    console.error(`❌ Error deleting blog image from S3:`, error);
    
    // Log specific S3 errors
    if (error.name === 'NoSuchKey') {
      console.error('🔍 Image not found in S3 - may have been already deleted');
    } else if (error.name === 'AccessDenied') {
      console.error('🚫 Access denied to S3 bucket');
    } else if (error.name === 'NoSuchBucket') {
      console.error('🪣 S3 bucket does not exist');
    }
    
    // Re-throw the error to fail the entire deletion process
    throw new Error(`Failed to delete blog image from S3: ${error.message}`);
  }
}

/**
 * Delete all images associated with a blog post
 * @param {Object} blogPost - The blog post object containing image URLs
 * @returns {Promise<boolean>} - true if all deletions successful or no images to delete
 * @throws {Error} - if any S3 deletion fails
 */
export async function deleteBlogImages(blogPost) {
  try {
    if (!blogPost) {
      console.log('ℹ️ No blog post provided for image deletion');
      return true;
    }

    const imageDeletions = [];

    // Check for featured image
    if (blogPost.featuredImage) {
      console.log(`🗑️ Deleting featured image for blog post: ${blogPost.title}`);
      imageDeletions.push(deleteBlogImage(blogPost.featuredImage));
    }

    // Check for any other image fields that might exist
    if (blogPost.image) {
      console.log(`🗑️ Deleting image for blog post: ${blogPost.title}`);
      imageDeletions.push(deleteBlogImage(blogPost.image));
    }

    if (blogPost.thumbnail) {
      console.log(`🗑️ Deleting thumbnail for blog post: ${blogPost.title}`);
      imageDeletions.push(deleteBlogImage(blogPost.thumbnail));
    }

    // Wait for all image deletions to complete
    if (imageDeletions.length > 0) {
      console.log(`⏳ Waiting for ${imageDeletions.length} image deletions to complete...`);
      await Promise.all(imageDeletions);
      console.log('✅ All blog images deleted successfully');
    } else {
      console.log('ℹ️ No images to delete for this blog post');
    }

    return true;
  } catch (error) {
    console.error('❌ Error during blog image deletion:', error);
    throw error; // Re-throw to fail the entire deletion process
  }
}
