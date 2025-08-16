#!/usr/bin/env node

// Send test Telegram message
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

async function sendTestMessage() {
  console.log('📱 Sending Test Telegram Message\n');

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  console.log('📋 Configuration:');
  console.log('   Bot Token:', botToken ? `${botToken.substring(0, 10)}...` : '❌ Missing');
  console.log('   Chat ID:', chatId || '❌ Missing');

  if (!botToken || !chatId) {
    console.log('\n❌ Missing Telegram configuration');
    return;
  }

  try {
    console.log('\n📤 Sending test message...');
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: '🧪 Test message from Sway Quest Blog System\n\nTime: ' + new Date().toLocaleString(),
        parse_mode: 'HTML'
      })
    });

    const result = await response.json();
    
    if (result.ok) {
      console.log('✅ Test message sent successfully!');
      console.log('📱 Check your Telegram chat for the test message.');
      console.log('   Message ID:', result.result.message_id);
    } else {
      console.log('❌ Failed to send message:', result.description);
      console.log('   Error Code:', result.error_code);
    }
  } catch (error) {
    console.error('❌ Error sending message:', error.message);
  }
}

// Run the test
sendTestMessage().catch(error => {
  console.error('❌ Test failed with error:', error);
});
