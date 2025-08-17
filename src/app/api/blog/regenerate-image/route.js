import { NextResponse } from 'next/server';
import { regenerateBlogImage } from '../../../../lib/imageService';
import { blogService } from '../../../../lib/blogService';

export async function POST(request) {
  try {
    // Check admin authentication
    const adminPassword = request.headers.get('x-admin-password');
    if (adminPassword !== 'admin-authenticated') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { slug, model, customPrompt } = await request.json();

    if (!slug || !model) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: slug and model' 
      }, { status: 400 });
    }

    // Get the blog post to get the topic and current image
    const blogPost = await blogService.getPostBySlug(slug);
    if (!blogPost) {
      return NextResponse.json({ 
        success: false, 
        error: 'Blog post not found' 
      }, { status: 404 });
    }

    // Regenerate the image
    const result = await regenerateBlogImage(
      blogPost.title, 
      slug, 
      model, 
      blogPost.featuredImage,
      customPrompt
    );

    if (!result.success) {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 500 });
    }

    // Update the blog post with the new image URL
    await blogService.updatePost(blogPost.id, {
      featuredImage: result.newImageUrl
    });

    return NextResponse.json({
      success: true,
      newImageUrl: result.newImageUrl,
      message: 'Image regenerated successfully'
    });

  } catch (error) {
    console.error('Error regenerating blog image:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
