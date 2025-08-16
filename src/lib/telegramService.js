// Telegram notification service for blog automation
class TelegramService {
  constructor() {
    this._botToken = null;
    this._chatId = null;
    this._enabled = null;
  }

  get botToken() {
    if (this._botToken === null) {
      this._botToken = process.env.TELEGRAM_BOT_TOKEN;
    }
    return this._botToken;
  }

  get chatId() {
    if (this._chatId === null) {
      this._chatId = process.env.TELEGRAM_CHAT_ID;
    }
    return this._chatId;
  }

  get enabled() {
    if (this._enabled === null) {
      this._enabled = !!(this.botToken && this.chatId);
    }
    return this._enabled;
  }

  // Send a simple text message
  async sendMessage(text) {
    // Re-check environment variables on each call
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const isEnabled = !!(botToken && chatId);
    
    if (!isEnabled) {
      console.log('📱 Telegram notifications disabled (missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID)');
      console.log('   Bot Token:', botToken ? 'Set' : 'Missing');
      console.log('   Chat ID:', chatId ? 'Set' : 'Missing');
      return false;
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML'
        })
      });

      const result = await response.json();
      
      if (result.ok) {
        console.log('✅ Telegram notification sent successfully');
        return true;
      } else {
        console.error('❌ Telegram notification failed:', result.description);
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending Telegram notification:', error);
      return false;
    }
  }

  // Send a blog post creation notification
  async sendBlogPostNotification(post) {
    // Re-check environment variables on each call
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const isEnabled = !!(botToken && chatId);
    
    if (!isEnabled) {
      console.log('📱 Telegram notifications disabled');
      return false;
    }

    const characterEmojis = {
      luna: '✨',
      marcus: '😎',
      alex: '💪',
      zara: '🔥',
      kai: '🌙',
      jordan: '🏃',
      rio: '🎵'
    };

    const emoji = characterEmojis[post.character] || '👤';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sway.quest';
    const postUrl = `${siteUrl}/blog/${post.slug}`;

    const message = `
🎉 <b>New Blog Post Created!</b>

${emoji} <b>${post.title}</b>

👤 <b>Author:</b> ${post.author}
📂 <b>Category:</b> ${post.category}
⏱️ <b>Read Time:</b> ${post.readTime} min
📅 <b>Created:</b> ${new Date(post.createdAt).toLocaleDateString()}

🔗 <a href="${postUrl}">Read the full post</a>

#BlogPost #Dance #${post.category.replace('-', '')}
    `.trim();

    return await this.sendMessage(message);
  }

  // Send automation status notification
  async sendAutomationStatus(success, details = {}) {
    // Re-check environment variables on each call
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const isEnabled = !!(botToken && chatId);
    
    if (!isEnabled) {
      console.log('📱 Telegram notifications disabled');
      return false;
    }

    const status = success ? '✅' : '❌';
    const title = success ? 'Blog Automation Success' : 'Blog Automation Failed';
    
    let message = `
🤖 <b>${title}</b>

${status} <b>Status:</b> ${success ? 'Success' : 'Failed'}
📅 <b>Date:</b> ${new Date().toLocaleDateString()}
⏰ <b>Time:</b> ${new Date().toLocaleTimeString()}
    `;

    if (success && details.post) {
      const characterEmojis = {
        luna: '✨',
        marcus: '😎',
        alex: '💪',
        zara: '🔥',
        kai: '🌙',
        jordan: '🏃',
        rio: '🎵'
      };

      const emoji = characterEmojis[details.post.character] || '👤';
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sway.quest';
      const postUrl = `${siteUrl}/blog/${details.post.slug}`;

      message += `

📝 <b>Generated Post:</b>
${emoji} ${details.post.title}

👤 <b>Author:</b> ${details.post.author}
📂 <b>Category:</b> ${details.post.category}

🔗 <a href="${postUrl}">View Post</a>
      `;
    } else if (!success && details.error) {
      message += `

❌ <b>Error:</b> ${details.error}
      `;
    }

    return await this.sendMessage(message);
  }

  // Send weekly summary
  async sendWeeklySummary(stats) {
    if (!this.enabled) {
      console.log('📱 Telegram notifications disabled');
      return false;
    }

    const message = `
📊 <b>Weekly Blog Summary</b>

📅 <b>Period:</b> ${stats.period}
📝 <b>Posts Created:</b> ${stats.postsCreated}
👥 <b>Characters Used:</b> ${stats.charactersUsed.join(', ')}
📂 <b>Categories Covered:</b> ${stats.categoriesCovered.join(', ')}

🎯 <b>Top Performing Posts:</b>
${stats.topPosts.map((post, index) => 
  `${index + 1}. ${post.title} (${post.views} views)`
).join('\n')}

#WeeklySummary #BlogStats
    `.trim();

    return await this.sendMessage(message);
  }

  // Test the Telegram connection
  async testConnection() {
    if (!this.enabled) {
      console.log('📱 Telegram notifications disabled (missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID)');
      return false;
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${this.botToken}/getMe`);
      const result = await response.json();
      
      if (result.ok) {
        console.log('✅ Telegram bot connection successful');
        console.log(`🤖 Bot: @${result.result.username}`);
        return true;
      } else {
        console.error('❌ Telegram bot connection failed:', result.description);
        return false;
      }
    } catch (error) {
      console.error('❌ Error testing Telegram connection:', error);
      return false;
    }
  }
}

// Export singleton instance
export const telegramService = new TelegramService();
export { TelegramService };
export default telegramService;
