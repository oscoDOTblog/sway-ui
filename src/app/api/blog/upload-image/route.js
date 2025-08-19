import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, BLOG_IMAGES_BUCKET } from '../../../../lib/aws-config';
import { blogService } from '../../../../lib/blogService';
import sharp from 'sharp';

export async function POST(request) {
  try {
    // Check admin authentication
    const adminPassword = request.headers.get('x-admin-password');
    if (adminPassword !== 'admin-authenticated') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('image');
    const slug = formData.get('slug');

    if (!file || !slug) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: image and slug' 
      }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ 
        success: false, 
        error: 'File must be an image' 
      }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        success: false, 
        error: 'File size must be less than 10MB' 
      }, { status: 400 });
    }

    // Get the blog post to verify it exists
    const blogPost = await blogService.getPostBySlug(slug);
    if (!blogPost) {
      return NextResponse.json({ 
        success: false, 
        error: 'Blog post not found' 
      }, { status: 404 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Process and optimize the image
    let processedBuffer;
    try {
      processedBuffer = await sharp(buffer)
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
    } catch (error) {
      console.error('Error processing image:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to process image' 
      }, { status: 500 });
    }

    // Create filename with timestamp
    const timestamp = Date.now();
    const filename = `blog/${slug}-upload-${timestamp}.jpg`;

    // Upload to S3
    const uploadCommand = new PutObjectCommand({
      Bucket: BLOG_IMAGES_BUCKET,
      Key: filename,
      Body: processedBuffer,
      ContentType: 'image/jpeg',
      CacheControl: 'public, max-age=31536000', // 1 year cache
      Metadata: {
        'uploaded-by': 'admin-upload',
        'blog-slug': slug,
        'uploaded-at': new Date().toISOString()
      }
    });

    await s3Client.send(uploadCommand);

    // Generate S3 URL
    const s3Url = `https://${BLOG_IMAGES_BUCKET}.s3.amazonaws.com/${filename}`;

    // Update the blog post with the new image URL
    await blogService.updatePost(blogPost.id, {
      featuredImage: s3Url
    });

    return NextResponse.json({
      success: true,
      imageUrl: s3Url,
      message: 'Image uploaded and blog post updated successfully'
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    
    // Log specific S3 errors
    if (error.name === 'NoSuchBucket') {
      console.error('🪣 S3 bucket does not exist:', BLOG_IMAGES_BUCKET);
    } else if (error.name === 'AccessDenied') {
      console.error('🚫 Access denied to S3 bucket');
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
