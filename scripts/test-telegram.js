#!/usr/bin/env node

// Test Telegram Bot Connection
import { telegramService } from '../src/lib/telegramService.js';

async function testTelegram() {
  console.log('🧪 Testing Telegram Bot Connection\n');

  // Test 1: Connection
  console.log('1️⃣ Testing bot connection...');
  const connectionSuccess = await telegramService.testConnection();
  
  if (!connectionSuccess) {
    console.log('❌ Bot connection failed. Please check your TELEGRAM_BOT_TOKEN.');
    return;
  }

  // Test 2: Send test message
  console.log('\n2️⃣ Sending test message...');
  const testMessage = `
🧪 <b>Telegram Bot Test</b>

✅ <b>Status:</b> Connection successful
📅 <b>Date:</b> ${new Date().toLocaleDateString()}
⏰ <b>Time:</b> ${new Date().toLocaleTimeString()}

🎉 Your Telegram notifications are working!
You'll receive alerts when blog posts are created.

#Test #BlogBot #SwayQuest
  `.trim();

  const messageSuccess = await telegramService.sendMessage(testMessage);
  
  if (messageSuccess) {
    console.log('✅ Test message sent successfully!');
    console.log('📱 Check your Telegram chat for the test message.');
  } else {
    console.log('❌ Failed to send test message.');
    console.log('   Check your TELEGRAM_CHAT_ID.');
  }

  // Test 3: Simulate blog post notification
  console.log('\n3️⃣ Testing blog post notification...');
  const mockPost = {
    title: "Test Blog Post: How to Master Dance Moves",
    author: "Luna",
    character: "luna",
    category: "dance-tips",
    readTime: 5,
    createdAt: new Date().toISOString(),
    slug: "2025-08-16-test-blog-post"
  };

  const notificationSuccess = await telegramService.sendBlogPostNotification(mockPost);
  
  if (notificationSuccess) {
    console.log('✅ Blog post notification test successful!');
    console.log('📱 You should receive a mock blog post notification.');
  } else {
    console.log('❌ Blog post notification test failed.');
  }

  console.log('\n🎯 Summary:');
  console.log(`   Connection: ${connectionSuccess ? '✅' : '❌'}`);
  console.log(`   Test Message: ${messageSuccess ? '✅' : '❌'}`);
  console.log(`   Blog Notification: ${notificationSuccess ? '✅' : '❌'}`);

  if (connectionSuccess && messageSuccess && notificationSuccess) {
    console.log('\n🎉 All tests passed! Your Telegram bot is ready for blog notifications.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check your configuration.');
  }
}

// Run the test
testTelegram().catch(error => {
  console.error('❌ Test failed with error:', error);
}); 