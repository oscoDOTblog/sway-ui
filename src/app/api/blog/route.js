import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { blogService } from '../../../lib/blogService';

// GET /api/blog - Get all blog posts
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit')) || 12;
    const page = parseInt(searchParams.get('page')) || 1;
    const offset = (page - 1) * limit;

    let posts = [];

    if (category) {
      posts = await blogService.getPostsByCategory(category);
    } else if (tag) {
      posts = await blogService.getPostsByTag(tag);
    } else if (search) {
      posts = await blogService.searchPosts(search);
    } else {
      posts = await blogService.getAllPosts();
    }

    // Sort by publishedAt descending (newest first)
    posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    // Apply pagination
    const paginatedPosts = posts.slice(offset, offset + limit);
    const total = posts.length;
    const hasMore = offset + limit < total;

    return NextResponse.json({
      success: true,
      posts: paginatedPosts,
      pagination: {
        total,
        limit,
        offset,
        hasMore,
      },
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// POST /api/blog - Create a new blog post
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'slug', 'content', 'excerpt'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(body.slug)) {
      return NextResponse.json(
        { success: false, error: 'Invalid slug format. Use only lowercase letters, numbers, and hyphens.' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPost = await blogService.getPostBySlug(body.slug);
    if (existingPost) {
      return NextResponse.json(
        { success: false, error: 'A post with this slug already exists' },
        { status: 409 }
      );
    }

    // Create the post
    const post = await blogService.createPost(body);

    // 🔄 Invalidate cache to reflect new post immediately
    console.log('🔄 Invalidating cache for new blog post...');
    try {
      // Invalidate the blog index page
      revalidatePath('/blog');
      // Invalidate the specific blog post page
      revalidatePath(`/blog/${post.slug}`);
      console.log(`✅ Cache invalidated for new blog post: ${post.slug}`);
    } catch (cacheError) {
      console.warn('⚠️ Cache invalidation failed:', cacheError.message);
      // Don't fail the entire request if cache invalidation fails
    }

    return NextResponse.json({
      success: true,
      post,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    
    if (error.message.includes('does not exist')) {
      return NextResponse.json(
        { success: false, error: 'Blog posts table does not exist. Please create it first.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
