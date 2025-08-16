import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, QueryCommand, ScanCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { NEWSLETTER_TABLE } from './aws-config.js';

// Initialize DynamoDB client
const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient);
const TABLE_NAME = NEWSLETTER_TABLE;

// Helper function to generate subscriber ID
function generateSubscriberId() {
  return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Add a new newsletter subscriber
 * @param {Object} subscriberData - Subscriber information
 * @param {string} subscriberData.email - Email address
 * @param {string} [subscriberData.firstName] - First name
 * @param {string} [subscriberData.lastName] - Last name
 * @param {string} [subscriberData.source] - Source of subscription
 * @param {Array} [subscriberData.tags] - Tags for segmentation
 * @param {Object} [subscriberData.preferences] - User preferences
 * @returns {Promise<Object>} Created subscriber record
 */
export async function addSubscriber(subscriberData) {
  try {
    const now = new Date().toISOString();
    const subscriberId = generateSubscriberId();
    
    const subscriber = {
      email: subscriberData.email.toLowerCase(),
      subscriberId,
      firstName: subscriberData.firstName || null,
      lastName: subscriberData.lastName || null,
      subscribedAt: now,
      source: subscriberData.source || 'sway-ui',
      status: 'active',
      emailCount: 0,
      openRate: 0,
      clickRate: 0,
      createdAt: now,
      updatedAt: now,
      tags: subscriberData.tags || ['newsletter'],
      preferences: {
        frequency: 'weekly',
        categories: ['dance', 'music'],
        ...subscriberData.preferences
      }
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: subscriber,
      ConditionExpression: 'attribute_not_exists(email)'
    });

    await dynamoDocClient.send(command);
    
    console.log(`✅ Added subscriber: ${subscriber.email}`);
    return { success: true, subscriber };
    
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') {
      return { success: false, error: 'Email already subscribed' };
    }
    console.error('❌ Failed to add subscriber:', error);
    throw error;
  }
}

/**
 * Get a subscriber by email
 * @param {string} email - Email address
 * @returns {Promise<Object|null>} Subscriber record or null
 */
export async function getSubscriber(email) {
  try {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        email: email.toLowerCase(),
        subscriberId: 'sub_primary' // You might need to adjust this based on your actual sort key strategy
      }
    });

    const { Item } = await dynamoDocClient.send(command);
    return Item;
    
  } catch (error) {
    console.error('❌ Failed to get subscriber:', error);
    throw error;
  }
}

/**
 * Update subscriber information
 * @param {string} email - Email address
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Update result
 */
export async function updateSubscriber(email, updates) {
  try {
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
    
    // Always update the updatedAt timestamp
    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        email: email.toLowerCase(),
        subscriberId: 'sub_primary' // Adjust based on your sort key strategy
      },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    });

    const { Attributes } = await dynamoDocClient.send(command);
    
    console.log(`✅ Updated subscriber: ${email}`);
    return { success: true, subscriber: Attributes };
    
  } catch (error) {
    console.error('❌ Failed to update subscriber:', error);
    throw error;
  }
}

/**
 * Unsubscribe a user
 * @param {string} email - Email address
 * @returns {Promise<Object>} Unsubscribe result
 */
export async function unsubscribeSubscriber(email) {
  return updateSubscriber(email, { status: 'unsubscribed' });
}

/**
 * Get all active subscribers
 * @param {Object} options - Query options
 * @param {number} [options.limit] - Maximum number of results
 * @param {string} [options.nextToken] - Pagination token
 * @returns {Promise<Object>} Query results
 */
export async function getActiveSubscribers(options = {}) {
  try {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': 'active'
      },
      Limit: options.limit || 100,
      ExclusiveStartKey: options.nextToken
    });

    const result = await dynamoDocClient.send(command);
    
    return {
      subscribers: result.Items || [],
      nextToken: result.LastEvaluatedKey,
      count: result.Count
    };
    
  } catch (error) {
    console.error('❌ Failed to get active subscribers:', error);
    throw error;
  }
}

/**
 * Get subscribers by source
 * @param {string} source - Source filter
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Query results
 */
export async function getSubscribersBySource(source, options = {}) {
  try {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: '#source = :source',
      ExpressionAttributeNames: {
        '#source': 'source'
      },
      ExpressionAttributeValues: {
        ':source': source
      },
      Limit: options.limit || 100,
      ExclusiveStartKey: options.nextToken
    });

    const result = await dynamoDocClient.send(command);
    
    return {
      subscribers: result.Items || [],
      nextToken: result.LastEvaluatedKey,
      count: result.Count
    };
    
  } catch (error) {
    console.error('❌ Failed to get subscribers by source:', error);
    throw error;
  }
}

/**
 * Update email campaign statistics
 * @param {string} email - Email address
 * @param {Object} stats - Statistics to update
 * @param {number} [stats.emailCount] - Number of emails sent
 * @param {number} [stats.openRate] - Open rate percentage
 * @param {number} [stats.clickRate] - Click rate percentage
 * @returns {Promise<Object>} Update result
 */
export async function updateEmailStats(email, stats) {
  const updates = {};
  
  if (stats.emailCount !== undefined) {
    updates.emailCount = stats.emailCount;
  }
  if (stats.openRate !== undefined) {
    updates.openRate = stats.openRate;
  }
  if (stats.clickRate !== undefined) {
    updates.clickRate = stats.clickRate;
  }
  
  updates.lastEmailSent = new Date().toISOString();
  
  return updateSubscriber(email, updates);
}

/**
 * Get subscriber count
 * @returns {Promise<number>} Total subscriber count
 */
export async function getSubscriberCount() {
  try {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      Select: 'COUNT'
    });

    const { Count } = await dynamoDocClient.send(command);
    return Count || 0;
    
  } catch (error) {
    console.error('❌ Failed to get subscriber count:', error);
    throw error;
  }
}

/**
 * Delete a subscriber (for GDPR compliance)
 * @param {string} email - Email address
 * @returns {Promise<Object>} Delete result
 */
export async function deleteSubscriber(email) {
  try {
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        email: email.toLowerCase(),
        subscriberId: 'sub_primary' // Adjust based on your sort key strategy
      }
    });

    await dynamoDocClient.send(command);
    
    console.log(`✅ Deleted subscriber: ${email}`);
    return { success: true };
    
  } catch (error) {
    console.error('❌ Failed to delete subscriber:', error);
    throw error;
  }
}

/**
 * Get subscribers for email campaign
 * @param {Object} options - Campaign options
 * @param {Array} [options.tags] - Filter by tags
 * @param {string} [options.source] - Filter by source
 * @param {number} [options.limit] - Maximum subscribers to return
 * @returns {Promise<Array>} Array of subscriber emails
 */
export async function getCampaignSubscribers(options = {}) {
  try {
    let filterExpression = '#status = :status';
    const expressionAttributeNames = {
      '#status': 'status'
    };
    const expressionAttributeValues = {
      ':status': 'active'
    };

    // Add tag filter if specified
    if (options.tags && options.tags.length > 0) {
      filterExpression += ' AND contains(#tags, :tag)';
      expressionAttributeNames['#tags'] = 'tags';
      expressionAttributeValues[':tag'] = options.tags[0]; // Simplified for now
    }

    // Add source filter if specified
    if (options.source) {
      filterExpression += ' AND #source = :source';
      expressionAttributeNames['#source'] = 'source';
      expressionAttributeValues[':source'] = options.source;
    }

    const command = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: filterExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      Limit: options.limit || 1000
    });

    const result = await dynamoDocClient.send(command);
    
    // Return just the email addresses for the campaign
    return (result.Items || []).map(item => item.email);
    
  } catch (error) {
    console.error('❌ Failed to get campaign subscribers:', error);
    throw error;
  }
}
