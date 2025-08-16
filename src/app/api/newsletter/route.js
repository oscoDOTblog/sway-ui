import { NextResponse } from 'next/server.js';
import { addSubscriber } from '../../../lib/newsletterService.js';
import axios from 'axios';

// Telegram configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_API = TELEGRAM_BOT_TOKEN ? `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}` : null;

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Basic validation
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Send Telegram notification
    let telegramSuccess = false;
    if (TELEGRAM_API && TELEGRAM_CHAT_ID) {
      try {
        console.log('Sending newsletter subscription to Telegram...');
        
        const telegramMessage = `📧 New Newsletter Subscription!\n\n📧 Email: ${email}\n\nSource: sway-ui newsletter form`;
        
        const telegramResponse = await axios.post(`${TELEGRAM_API}/sendMessage`, {
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramMessage,
          parse_mode: 'HTML'
        });
        
        console.log('Telegram response:', telegramResponse.data);
        telegramSuccess = true;
        console.log('✅ Newsletter subscription sent to Telegram successfully');
      } catch (telegramError) {
        console.error('❌ Telegram error:', telegramError.response?.data || telegramError.message);
        // Don't fail the request if Telegram fails
      }
    } else {
      console.log('⚠️ Telegram not configured - skipping notification');
    }

    // Add subscriber to DynamoDB
    const result = await addSubscriber({
      email: email,
      source: 'sway-ui'
    });

    if (!result.success) {
      if (result.error === 'Email already subscribed') {
        return NextResponse.json(
          { error: 'Email already subscribed' },
          { status: 400 }
        );
      }
      console.error('DynamoDB error:', result.error);
      return NextResponse.json(
        { error: 'Database error occurred' },
        { status: 500 }
      );
    }

    // Log the subscription
    console.log('Newsletter subscription:', { email, telegramSent: telegramSuccess, dynamoSuccess: result.success });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully subscribed! We\'ll keep you updated on new projects.',
        telegramSent: telegramSuccess
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
} 