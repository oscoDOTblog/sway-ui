const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    });
    
    return envVars;
  }
  return {};
}

// Test Telegram API directly
async function testTelegramAPI() {
  const envVars = loadEnvFile();
  const TELEGRAM_BOT_TOKEN = envVars.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = envVars.TELEGRAM_CHAT_ID;
  
  console.log('🔧 Testing Telegram API Configuration...');
  console.log('- TELEGRAM_BOT_TOKEN exists:', !!TELEGRAM_BOT_TOKEN);
  console.log('- TELEGRAM_CHAT_ID exists:', !!TELEGRAM_CHAT_ID);
  console.log('- TELEGRAM_CHAT_ID value:', TELEGRAM_CHAT_ID);
  
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('❌ Missing Telegram configuration');
    return;
  }
  
  const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
  
  try {
    console.log('📤 Sending test message...');
    const response = await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: '🧪 Test message from debug script\nTime: ' + new Date().toISOString()
    });
    
    console.log('✅ Telegram API working correctly!');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Telegram API error:');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data || error.message);
  }
}

// Test newsletter API endpoint
async function testNewsletterAPI() {
  console.log('\n📧 Testing Newsletter API...');
  
  try {
    const response = await axios.post('http://localhost:3000/api/newsletter-signup', {
      email: `test-${Date.now()}@example.com`
    });
    
    console.log('✅ Newsletter API response:', response.data);
  } catch (error) {
    console.log('❌ Newsletter API error:');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data || error.message);
  }
}

// Run tests
async function runTests() {
  await testTelegramAPI();
  await testNewsletterAPI();
}

runTests().catch(console.error); 