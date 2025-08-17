#!/usr/bin/env node

// Debug script for Telegram notifications
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Create a new Telegram service instance after loading env vars
import { TelegramService } from '../src/lib/telegramService.js';
const telegramService = new TelegramService();

async function debugTelegram() {
  console.log('🔍 Debugging Telegram Configuration\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('   TELEGRAM_BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN ? '✅ Set' : '❌ Missing');
  console.log('   TELEGRAM_CHAT_ID:', process.env.TELEGRAM_CHAT_ID ? '✅ Set' : '❌ Missing');
  
  if (process.env.TELEGRAM_BOT_TOKEN) {
    console.log('   Token preview:', process.env.TELEGRAM_BOT_TOKEN.substring(0, 10) + '...');
  }
  if (process.env.TELEGRAM_CHAT_ID) {
    console.log('   Chat ID:', process.env.TELEGRAM_CHAT_ID);
  }

  console.log('\n🔧 Service Status:');
  console.log('   Enabled:', telegramService.enabled);
  console.log('   Bot Token:', telegramService.botToken ? '✅ Available' : '❌ Missing');
  console.log('   Chat ID:', telegramService.chatId ? '✅ Available' : '❌ Missing');

  if (!telegramService.enabled) {
    console.log('\n❌ Telegram service is disabled. Please check your environment variables.');
    return;
  }

  // Test connection
  console.log('\n🧪 Testing Connection...');
  const connectionTest = await telegramService.testConnection();
  console.log('   Connection:', connectionTest ? '✅ Success' : '❌ Failed');

  if (!connectionTest) {
    console.log('\n❌ Connection failed. Please check your bot token and chat ID.');
    return;
  }

  // Test simple message
  console.log('\n📤 Testing Simple Message...');
  const simpleMessageTest = await telegramService.sendMessage('🧪 Test message from debug script');
  console.log('   Simple Message:', simpleMessageTest ? '✅ Sent' : '❌ Failed');

  // Test blog post notification
  console.log('\n📝 Testing Blog Post Notification...');
  const mockPost = {
    title: "Debug Test: How to Master Dance Moves",
    author: "Luna",
    character: "luna",
    category: "dance-tips",
    readTime: 5,
    createdAt: new Date().toISOString(),
    slug: "2025-08-16-debug-test-post"
  };

  const blogNotificationTest = await telegramService.sendBlogPostNotification(mockPost);
  console.log('   Blog Notification:', blogNotificationTest ? '✅ Sent' : '❌ Failed');

  // Test automation status
  console.log('\n🤖 Testing Automation Status...');
  const automationTest = await telegramService.sendAutomationStatus(true, { 
    post: mockPost 
  });
  console.log('   Automation Status:', automationTest ? '✅ Sent' : '❌ Failed');

  console.log('\n🎯 Summary:');
  console.log(`   Connection: ${connectionTest ? '✅' : '❌'}`);
  console.log(`   Simple Message: ${simpleMessageTest ? '✅' : '❌'}`);
  console.log(`   Blog Notification: ${blogNotificationTest ? '✅' : '❌'}`);
  console.log(`   Automation Status: ${automationTest ? '✅' : '❌'}`);

  if (connectionTest && simpleMessageTest && blogNotificationTest && automationTest) {
    console.log('\n🎉 All tests passed! Telegram notifications should work.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the logs above for issues.');
  }
}

// Run the debug
debugTelegram().catch(error => {
  console.error('❌ Debug failed with error:', error);
});
