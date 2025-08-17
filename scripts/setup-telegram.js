#!/usr/bin/env node

// Telegram Bot Setup Script
import { telegramService } from '../src/lib/telegramService.js';

console.log('🤖 Telegram Bot Setup for Blog Notifications\n');

console.log('📋 Setup Instructions:\n');

console.log('1️⃣ Create a Telegram Bot:');
console.log('   • Open Telegram and search for "@BotFather"');
console.log('   • Send /newbot command');
console.log('   • Choose a name for your bot (e.g., "Sway Quest Blog Bot")');
console.log('   • Choose a username (must end with "bot", e.g., "swayquest_blog_bot")');
console.log('   • BotFather will give you a BOT TOKEN (keep this secret!)\n');

console.log('2️⃣ Get Your Chat ID:');
console.log('   • Start a chat with your bot (@your_bot_username)');
console.log('   • Send any message to the bot');
console.log('   • Visit: https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates');
console.log('   • Look for "chat":{"id":123456789} in the response');
console.log('   • That number is your CHAT_ID\n');

console.log('3️⃣ Set Environment Variables:');
console.log('   • Add to your .env file:');
console.log('     TELEGRAM_BOT_TOKEN=your_bot_token_here');
console.log('     TELEGRAM_CHAT_ID=your_chat_id_here');
console.log('   • Add to Vercel environment variables\n');

console.log('4️⃣ Test the Connection:');
console.log('   • Run: node scripts/test-telegram.js\n');

console.log('📱 What You\'ll Receive:');
console.log('   • Instant notifications when blog posts are created');
console.log('   • Post title, author, category, and read time');
console.log('   • Direct link to read the full post');
console.log('   • Automation status updates (success/failure)');
console.log('   • Weekly summaries (optional)\n');

console.log('🎯 Notification Types:');
console.log('   ✅ New blog post created (with post details)');
console.log('   ❌ Automation failures (with error details)');
console.log('   📊 Weekly summaries (optional feature)');
console.log('   🧪 Test messages (for setup verification)\n');

// Test connection if environment variables are set
if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
  console.log('🔍 Testing current configuration...\n');
  
  telegramService.testConnection().then(success => {
    if (success) {
      console.log('✅ Configuration looks good!');
      console.log('📱 You should receive notifications when blog posts are created.');
    } else {
      console.log('❌ Configuration needs to be fixed.');
      console.log('   Check your TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID values.');
    }
  });
} else {
  console.log('⚠️  Environment variables not set.');
  console.log('   Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID to test the connection.');
}
