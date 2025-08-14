import { 
  PutCommand, 
  GetCommand, 
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
        IndexName: 'slug-index',
        KeyConditionExpression: 'slug = :slug',
        ExpressionAttributeValues: {
          ':slug': slug,
        },
        FilterExpression: 'status = :status',
        ExpressionAttributeValues: {
          ':slug': slug,
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
      const command = new GetCommand({
        TableName: this.tableName,
        Key: { id },
      });

      const response = await dynamoDocClient.send(command);
      return response.Item;
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
        FilterExpression: 'status = :status',
        ExpressionAttributeValues: {
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
        FilterExpression: 'status = :status',
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
        FilterExpression: 'status = :status AND contains(tags, :tag)',
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
        Key: { id },
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
        Key: { id },
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
        Key: { id },
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
