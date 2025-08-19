import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
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

    // Check if image generation is enabled via environment variable
    if (process.env.APP_BLOG_GEN_IMAGE === 'false') {
      return NextResponse.json({ 
        success: false, 
        error: 'Image generation is disabled via APP_BLOG_GEN_IMAGE=false environment variable' 
      }, { status: 403 });
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

    // Invalidate the cache to ensure the updated image shows immediately
    revalidatePath('/blog');
    revalidatePath(`/blog/${slug}`);

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
