import { NextResponse } from 'next/server';
import { blogService } from '../../../../lib/blogService';

// GET /api/blog/[slug] - Get a single blog post
export async function GET(request, { params }) {
  try {
    const post = await blogService.getPostBySlug(params.slug);
    
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

// PUT /api/blog/[slug] - Update a blog post
export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    
    // Get the existing post to get its ID
    const existingPost = await blogService.getPostBySlug(params.slug);
    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Validate slug format if it's being updated
    if (body.slug && body.slug !== params.slug) {
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!slugRegex.test(body.slug)) {
        return NextResponse.json(
          { success: false, error: 'Invalid slug format. Use only lowercase letters, numbers, and hyphens.' },
          { status: 400 }
        );
      }

      // Check if new slug already exists
      const slugExists = await blogService.getPostBySlug(body.slug);
      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'A post with this slug already exists' },
          { status: 409 }
        );
      }
    }

    // Update the post
    const updatedPost = await blogService.updatePost(existingPost.id, body);

    return NextResponse.json({
      success: true,
      post: updatedPost,
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    
    if (error.message.includes('does not exist')) {
      return NextResponse.json(
        { success: false, error: 'Blog posts table does not exist. Please create it first.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/[slug] - Delete a blog post
export async function DELETE(request, { params }) {
  try {
    // Get the existing post to get its ID
    const existingPost = await blogService.getPostBySlug(params.slug);
    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Delete the post
    await blogService.deletePost(existingPost.id);

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    
    if (error.message.includes('does not exist')) {
      return NextResponse.json(
        { success: false, error: 'Blog posts table does not exist. Please create it first.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
