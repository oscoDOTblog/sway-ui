import { 
  PutCommand, 
  QueryCommand, 
  ScanCommand, 
  UpdateCommand,
  DeleteCommand
} from '@aws-sdk/lib-dynamodb';
import { dynamoDocClient, BLOG_POSTS_TABLE } from './aws-config';

class BlogService {
  constructor() {
    this.tableName = BLOG_POSTS_TABLE;
  }

  // Helper method to check if error is ResourceNotFoundException
  isResourceNotFoundError(error) {
    return error.name === 'ResourceNotFoundException';
  }

  // Create a new blog post
  async createPost(post) {
    try {
      const timestamp = new Date().toISOString();
      const postData = {
        pk: `BLOG#${post.slug}`,
        createdAt: post.createdAt || timestamp,
        id: post.id || `post_${Date.now()}`,
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        author: post.author || 'Sway Team',
        publishedAt: post.publishedAt || timestamp,
        updatedAt: timestamp,
        status: post.status || 'published',
        tags: post.tags || [],
        category: post.category || 'dance',
        featuredImage: post.featuredImage,
        seoTitle: post.seoTitle || post.title,
        seoDescription: post.seoDescription || post.excerpt,
        readTime: post.readTime || this.calculateReadTime(post.content),
        viewCount: 0,
        // For ISR - we'll use this to determine when to regenerate
        lastModified: timestamp,
      };

      const command = new PutCommand({
        TableName: this.tableName,
        Item: postData,
      });

      await dynamoDocClient.send(command);
      return postData;
    } catch (error) {
      if (this.isResourceNotFoundError(error)) {
        throw new Error(`Blog posts table '${this.tableName}' does not exist. Please create it first.`);
      }
      throw error;
    }
  }

  // Get a single blog post by slug
  async getPostBySlug(slug) {
    try {
      const command = new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'pk = :pk',
        ExpressionAttributeValues: {
          ':pk': `BLOG#${slug}`,
        },
        FilterExpression: '#status = :status',
        ExpressionAttributeNames: {
          '#status': 'status'
        },
        ExpressionAttributeValues: {
          ':pk': `BLOG#${slug}`,
          ':status': 'published',
        },
      });

      const response = await dynamoDocClient.send(command);
      const post = response.Items?.[0];

      if (!post) {
        return null;
      }

      // Increment view count
      await this.incrementViewCount(post.id);

      return post;
    } catch (error) {
      if (this.isResourceNotFoundError(error)) {
        console.warn(`Blog posts table '${this.tableName}' does not exist.`);
        return null;
      }
      throw error;
    }
  }

  // Get a single blog post by ID
  async getPostById(id) {
    try {
      // For this table structure, we need to query by pk and filter by id
      const command = new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'pk = :pk',
        FilterExpression: 'id = :id',
        ExpressionAttributeValues: {
          ':pk': `BLOG#${id}`,
          ':id': id,
        },
      });

      const response = await dynamoDocClient.send(command);
      return response.Items?.[0] || null;
    } catch (error) {
      if (this.isResourceNotFoundError(error)) {
        console.warn(`Blog posts table '${this.tableName}' does not exist.`);
        return null;
      }
      throw error;
    }
  }

  // Get all published blog posts (for ISR)
  async getAllPosts() {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'begins_with(pk, :pkPrefix) AND #status = :status',
        ExpressionAttributeNames: {
          '#status': 'status'
        },
        ExpressionAttributeValues: {
          ':pkPrefix': 'BLOG#',
          ':status': 'published',
        },
        ProjectionExpression: 'id, title, slug, excerpt, author, publishedAt, updatedAt, tags, category, featuredImage, readTime, viewCount',
      });

      const response = await dynamoDocClient.send(command);
      return response.Items || [];
    } catch (error) {
      if (this.isResourceNotFoundError(error)) {
        console.warn(`Blog posts table '${this.tableName}' does not exist.`);
        return [];
      }
      throw error;
    }
  }

  // Get posts by category
  async getPostsByCategory(category) {
    try {
      const command = new QueryCommand({
        TableName: this.tableName,
        IndexName: 'category-index',
        KeyConditionExpression: 'category = :category',
        ExpressionAttributeValues: {
          ':category': category,
        },
        FilterExpression: '#status = :status',
        ExpressionAttributeNames: {
          '#status': 'status'
        },
        ExpressionAttributeValues: {
          ':category': category,
          ':status': 'published',
        },
        ScanIndexForward: false, // Sort by publishedAt descending
      });

      const response = await dynamoDocClient.send(command);
      return response.Items || [];
    } catch (error) {
      if (this.isResourceNotFoundError(error)) {
        console.warn(`Blog posts table '${this.tableName}' does not exist.`);
        return [];
      }
      throw error;
    }
  }

  // Get posts by tag
  async getPostsByTag(tag) {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
        FilterExpression: '#status = :status AND contains(tags, :tag)',
        ExpressionAttributeNames: {
          '#status': 'status'
        },
        ExpressionAttributeValues: {
          ':status': 'published',
          ':tag': tag,
        },
        ScanIndexForward: false,
      });

      const response = await dynamoDocClient.send(command);
      return response.Items || [];
    } catch (error) {
      if (this.isResourceNotFoundError(error)) {
        console.warn(`Blog posts table '${this.tableName}' does not exist.`);
        return [];
      }
      throw error;
    }
  }

  // Get adjacent posts (previous and next)
  async getAdjacentPosts(currentSlug) {
    try {
      // Get all published posts sorted by publishedAt
      const command = new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'begins_with(pk, :pkPrefix) AND #status = :status',
        ExpressionAttributeNames: {
          '#status': 'status'
        },
        ExpressionAttributeValues: {
          ':pkPrefix': 'BLOG#',
          ':status': 'published',
        },
        ProjectionExpression: 'slug, title, excerpt, publishedAt, category',
      });

      const response = await dynamoDocClient.send(command);
      const posts = response.Items || [];
      
      // Sort posts by publishedAt (newest first)
      posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      
      // Find current post index
      const currentIndex = posts.findIndex(post => post.slug === currentSlug);
      
      if (currentIndex === -1) {
        return { prev: null, next: null };
      }
      
      // Get previous and next posts
      const prev = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;
      const next = currentIndex > 0 ? posts[currentIndex - 1] : null;
      
      return { prev, next };
    } catch (error) {
      if (this.isResourceNotFoundError(error)) {
        console.warn(`Blog posts table '${this.tableName}' does not exist.`);
        return { prev: null, next: null };
      }
      throw error;
    }
  }

  // Get related posts by category
  async getRelatedPosts(category, currentSlug, limit = 3) {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'begins_with(pk, :pkPrefix) AND #status = :status AND category = :category',
        ExpressionAttributeNames: {
          '#status': 'status'
        },
        ExpressionAttributeValues: {
          ':pkPrefix': 'BLOG#',
          ':status': 'published',
          ':category': category,
        },
        ProjectionExpression: 'slug, title, excerpt, publishedAt, category',
      });

      const response = await dynamoDocClient.send(command);
      const posts = response.Items || [];
      
      // Filter out current post and sort by publishedAt (newest first)
      const filteredPosts = posts
        .filter(post => post.slug !== currentSlug)
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        .slice(0, limit);
      
      return filteredPosts;
    } catch (error) {
      if (this.isResourceNotFoundError(error)) {
        console.warn(`Blog posts table '${this.tableName}' does not exist.`);
        return [];
      }
      throw error;
    }
  }

  // Update a blog post
  async updatePost(id, updates) {
    try {
      const timestamp = new Date().toISOString();
      const updateExpressions = [];
      const expressionAttributeNames = {};
      const expressionAttributeValues = {};

      // Build update expression dynamically
      Object.keys(updates).forEach((key, index) => {
        const attrName = `#attr${index}`;
        const attrValue = `:val${index}`;
        
        updateExpressions.push(`${attrName} = ${attrValue}`);
        expressionAttributeNames[attrName] = key;
        expressionAttributeValues[attrValue] = updates[key];
      });

      // Always update updatedAt and lastModified
      updateExpressions.push('#updatedAt = :updatedAt, #lastModified = :lastModified');
      expressionAttributeNames['#updatedAt'] = 'updatedAt';
      expressionAttributeNames['#lastModified'] = 'lastModified';
      expressionAttributeValues[':updatedAt'] = timestamp;
      expressionAttributeValues[':lastModified'] = timestamp;

      const command = new UpdateCommand({
        TableName: this.tableName,
        Key: { pk: `BLOG#${id}`, createdAt: id },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      });

      const response = await dynamoDocClient.send(command);
      return response.Attributes;
    } catch (error) {
      if (this.isResourceNotFoundError(error)) {
        throw new Error(`Blog posts table '${this.tableName}' does not exist. Please create it first.`);
      }
      throw error;
    }
  }

  // Delete a blog post
  async deletePost(id) {
    try {
      const command = new DeleteCommand({
        TableName: this.tableName,
        Key: { pk: `BLOG#${id}`, createdAt: id },
      });

      await dynamoDocClient.send(command);
      return true;
    } catch (error) {
      if (this.isResourceNotFoundError(error)) {
        throw new Error(`Blog posts table '${this.tableName}' does not exist. Please create it first.`);
      }
      throw error;
    }
  }

  // Increment view count
  async incrementViewCount(id) {
    try {
      const command = new UpdateCommand({
        TableName: this.tableName,
        Key: { pk: `BLOG#${id}`, createdAt: id },
        UpdateExpression: 'SET viewCount = if_not_exists(viewCount, :zero) + :inc',
        ExpressionAttributeValues: {
          ':inc': 1,
          ':zero': 0,
        },
      });

      await dynamoDocClient.send(command);
    } catch (error) {
      // Silently fail for view count updates
      console.warn('Failed to increment view count:', error.message);
    }
  }

  // Calculate read time based on content length
  calculateReadTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return readTime;
  }

  // Get all unique categories
  async getCategories() {
    try {
      const posts = await this.getAllPosts();
      const categories = [...new Set(posts.map(post => post.category))];
      return categories.filter(Boolean);
    } catch (error) {
      console.warn('Failed to get categories:', error.message);
      return [];
    }
  }

  // Get all unique tags
  async getTags() {
    try {
      const posts = await this.getAllPosts();
      const allTags = posts.flatMap(post => post.tags || []);
      const uniqueTags = [...new Set(allTags)];
      return uniqueTags.filter(Boolean);
    } catch (error) {
      console.warn('Failed to get tags:', error.message);
      return [];
    }
  }

  // Search posts by title or content
  async searchPosts(query) {
    try {
      const posts = await this.getAllPosts();
      const searchTerm = query.toLowerCase();
      
      return posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
      );
    } catch (error) {
      console.warn('Failed to search posts:', error.message);
      return [];
    }
  }
}

export const blogService = new BlogService();
