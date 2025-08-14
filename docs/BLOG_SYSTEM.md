# Blog System Documentation

## Overview

The Sway Quest blog system is a comprehensive, SEO-optimized blog built with Next.js 15, featuring Incremental Static Regeneration (ISR), markdown support, and AWS DynamoDB integration. The system is designed to maximize SEO performance while providing a beautiful, Netflix-style user experience.

## Features

### 🚀 Performance & SEO
- **Incremental Static Regeneration (ISR)** - Pages regenerate automatically
- **Static Generation** - Pre-built pages for optimal performance
- **SEO Optimized** - Meta tags, Open Graph, Twitter Cards, structured data
- **Markdown Support** - Rich content with syntax highlighting
- **Mobile Responsive** - Optimized for all devices

### 🎨 Design & UX
- **Netflix-Style Theming** - Dark theme with hot pink accents
- **Beautiful Typography** - Optimized for readability
- **Smooth Animations** - Engaging user interactions
- **Social Sharing** - Easy sharing on social platforms

### 📊 Content Management
- **AWS DynamoDB Integration** - Scalable, serverless database
- **Rich Content Support** - Images, videos, code blocks, tables
- **Tagging System** - Organize content with tags and categories
- **View Tracking** - Monitor post popularity
- **Read Time Calculation** - Automatic reading time estimates

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file with your AWS credentials:

```bash
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# DynamoDB Table Names
AWS_DYNAMODB_BLOG_POSTS=sway-blog-posts

# Site Configuration (optional)
NEXT_PUBLIC_SITE_URL=https://swayquest.vercel.app
```

### 3. Create DynamoDB Table

```bash
npm run setup:blog
```

This creates the blog posts table with proper indexes for optimal performance.

### 4. Create Sample Content

```bash
npm run create:sample
```

This adds a sample blog post to test the system.

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000/blog` to see your blog!

## Blog Structure

### Routes
- **Blog Index**: `/blog` - Lists all published posts
- **Individual Post**: `/blog/[slug]` - Displays a single post
- **API Endpoints**: `/api/blog` - REST API for content management

### Database Schema

The blog posts table includes these fields:

```javascript
{
  id: "post_1234567890",           // Unique identifier
  title: "Post Title",             // Post title
  slug: "post-title",              // URL-friendly slug
  content: "# Markdown content",   // Full markdown content
  excerpt: "Brief description",    // Short excerpt
  author: "Author Name",           // Post author
  publishedAt: "2024-01-01T00:00:00Z", // Publication date
  updatedAt: "2024-01-01T00:00:00Z",   // Last update
  status: "published",             // published/draft
  category: "dance-tips",          // Post category
  tags: ["beginner", "tips"],      // Array of tags
  featuredImage: "https://...",    // Featured image URL
  seoTitle: "SEO Title",           // Custom SEO title
  seoDescription: "SEO desc",      // Custom SEO description
  readTime: 5,                     // Reading time in minutes
  viewCount: 100,                  // View counter
  lastModified: "2024-01-01T00:00:00Z" // For ISR
}
```

### Global Secondary Indexes

For optimal performance, the table includes these indexes:

1. **slug-index** - Query posts by slug
2. **category-index** - Query posts by category
3. **status-published-index** - Query published posts
4. **last-modified-index** - For ISR regeneration

## Content Creation

### Using the API

Create a new blog post via API:

```bash
curl -X POST http://localhost:3000/api/blog \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Dance Blog Post",
    "slug": "my-dance-blog-post",
    "content": "# My Content\n\nThis is my blog post content...",
    "excerpt": "A brief description of the post",
    "author": "Your Name",
    "category": "dance-tips",
    "tags": ["beginner", "tutorial"],
    "featuredImage": "https://example.com/image.jpg",
    "status": "published"
  }'
```

### Markdown Formatting

The blog supports full markdown with these features:

```markdown
# H1 Heading
## H2 Heading
### H3 Heading

**Bold text** and *italic text*

- Bullet points
- More items

1. Numbered lists
2. Second item

> Blockquotes for important information

`inline code` and code blocks:

```javascript
function dance() {
  console.log("Let's dance!");
}
```

[Links](https://example.com)

![Images](https://example.com/image.jpg)

| Tables | Are | Supported |
|--------|-----|-----------|
| Row 1  | Data| Here      |
```

## SEO Optimization

### Automatic SEO Features

The blog system automatically generates:

- **Meta tags** (title, description, keywords)
- **Open Graph tags** for social media sharing
- **Twitter Card tags** for Twitter sharing
- **Canonical URLs** to prevent duplicate content
- **Structured data** for search engines
- **Sitemap-ready URLs** with proper slugs

### Custom SEO Fields

Each post can have custom SEO fields:

```javascript
{
  seoTitle: "Custom SEO Title - More Descriptive",
  seoDescription: "Custom meta description for better CTR",
  // ... other fields
}
```

### SEO Best Practices

1. **Use descriptive slugs** - `dance-tips-for-beginners` not `post-1`
2. **Write compelling excerpts** - 150-160 characters for meta descriptions
3. **Include relevant tags** - Helps with internal linking and categorization
4. **Use featured images** - Improves social media sharing
5. **Optimize content structure** - Use proper heading hierarchy (H1, H2, H3)

## ISR Configuration

### Regeneration Intervals

- **Blog Index**: Regenerates every hour (`revalidate: 3600`)
- **Individual Posts**: Regenerates every 30 minutes (`revalidate: 1800`)

### Manual Regeneration

Posts automatically regenerate when:
- The `lastModified` field is updated
- The revalidation period expires
- A new request comes in after the cache expires

## API Endpoints

### GET /api/blog
Get all blog posts with optional filtering:

```bash
# Get all posts
GET /api/blog

# Filter by category
GET /api/blog?category=dance-tips

# Filter by tag
GET /api/blog?tag=beginner

# Search posts
GET /api/blog?search=dance

# Pagination
GET /api/blog?limit=10&offset=0
```

### POST /api/blog
Create a new blog post:

```bash
POST /api/blog
Content-Type: application/json

{
  "title": "Post Title",
  "slug": "post-slug",
  "content": "Markdown content...",
  "excerpt": "Brief description",
  "author": "Author Name",
  "category": "category",
  "tags": ["tag1", "tag2"],
  "featuredImage": "https://...",
  "status": "published"
}
```

### GET /api/blog/[slug]
Get a specific blog post:

```bash
GET /api/blog/my-post-slug
```

### PUT /api/blog/[slug]
Update a blog post:

```bash
PUT /api/blog/my-post-slug
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

### DELETE /api/blog/[slug]
Delete a blog post:

```bash
DELETE /api/blog/my-post-slug
```

## ChatGPT Integration

### Recommended Format

For optimal SEO and rendering, format ChatGPT output as markdown:

```markdown
# Main Title

Brief introduction paragraph.

## Section 1

Content with **bold** and *italic* text.

### Subsection

- Bullet points
- More items

## Section 2

> Important quote or tip

## Conclusion

Summary and call to action.
```

### SEO Optimization Prompts

When generating content with ChatGPT, include these prompts:

1. **Include SEO-friendly headings** (H1, H2, H3)
2. **Write a compelling excerpt** (150-160 characters)
3. **Suggest relevant tags** for categorization
4. **Create an SEO title** (50-60 characters)
5. **Write a meta description** (150-160 characters)

### Example ChatGPT Prompt

```
Write a dance tutorial blog post about [topic]. 

Requirements:
- Use markdown formatting
- Include H1, H2, and H3 headings
- Write engaging, SEO-friendly content
- Include practical tips and examples
- End with a conclusion and call to action

Also provide:
- A compelling excerpt (150-160 characters)
- 5-7 relevant tags
- An SEO title (50-60 characters)
- A meta description (150-160 characters)
```

## Performance Optimization

### Built-in Optimizations

- **Static Generation** - Pages are pre-built at build time
- **ISR** - Automatic regeneration for fresh content
- **Image Optimization** - Next.js automatic image optimization
- **Code Splitting** - Automatic code splitting for faster loading
- **CSS Modules** - Scoped styles for better performance

### Monitoring

Track performance with:
- **View counts** - Monitor post popularity
- **Read time** - Understand content engagement
- **Social shares** - Track content virality

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_production_key
AWS_SECRET_ACCESS_KEY=your_production_secret
AWS_DYNAMODB_BLOG_POSTS=sway-blog-posts
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Troubleshooting

### Common Issues

1. **"Table does not exist"**
   - Run `npm run setup:blog` to create the table

2. **"Access denied"**
   - Check AWS credentials and permissions
   - Ensure IAM user has DynamoDB permissions

3. **Posts not showing**
   - Check that posts have `status: "published"`
   - Verify the DynamoDB table exists and has data

4. **ISR not working**
   - Check that `lastModified` field is being updated
   - Verify revalidation periods are set correctly

### Debug Mode

Enable debug logging:

```bash
NODE_ENV=development npm run dev
```

## Future Enhancements

Potential improvements to consider:

1. **Search functionality** - Full-text search across posts
2. **Comments system** - User engagement features
3. **Related posts** - Automatic content recommendations
4. **Newsletter integration** - Email marketing features
5. **Analytics dashboard** - Detailed performance metrics
6. **Content scheduling** - Future publication dates
7. **Multi-author support** - Author profiles and management
8. **Content versioning** - Draft and revision history

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review the API documentation
3. Check the console for error messages
4. Verify AWS credentials and permissions

---

**Happy blogging! 🎉**
