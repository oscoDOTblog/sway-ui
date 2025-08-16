#!/usr/bin/env node

// Check recent Telegram messages
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

async function checkTelegramMessages() {
  console.log('📱 Checking Recent Telegram Messages\n');

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.log('❌ Missing Telegram configuration');
    return;
  }

  try {
    // Get recent updates
    console.log('📡 Fetching recent messages...');
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates?limit=10`);
    const data = await response.json();

    if (data.ok) {
      console.log(`✅ Found ${data.result.length} recent updates`);
      
      if (data.result.length === 0) {
        console.log('📭 No recent messages found');
        return;
      }

      console.log('\n📋 Recent Messages:');
      data.result.forEach((update, index) => {
        if (update.message) {
          const message = update.message;
          const date = new Date(message.date * 1000);
          console.log(`\n${index + 1}. Message from ${message.from?.first_name || 'Unknown'}:`);
          console.log(`   📅 Date: ${date.toLocaleString()}`);
          console.log(`   💬 Text: ${message.text?.substring(0, 100)}${message.text?.length > 100 ? '...' : ''}`);
          console.log(`   🆔 Chat ID: ${message.chat.id}`);
        }
      });
    } else {
      console.log('❌ Failed to fetch messages:', data.description);
    }
  } catch (error) {
    console.error('❌ Error checking messages:', error.message);
  }
}

// Run the check
checkTelegramMessages().catch(error => {
  console.error('❌ Check failed with error:', error);
});
