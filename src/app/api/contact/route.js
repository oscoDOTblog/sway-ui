import { NextResponse } from 'next/server';
import axios from 'axios';

// Telegram configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_API = TELEGRAM_BOT_TOKEN ? `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}` : null;

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
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
        console.log('Sending contact form to Telegram...');
        
        const telegramMessage = `📧 New Contact Form Submission!\n\n👤 Name: ${name}\n📧 Email: ${email}\n💬 Message: ${message}\n\nSource: sway-ui contact form`;
        
        const telegramResponse = await axios.post(`${TELEGRAM_API}/sendMessage`, {
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramMessage,
          parse_mode: 'HTML'
        });
        
        console.log('Telegram response:', telegramResponse.data);
        telegramSuccess = true;
        console.log('✅ Contact form sent to Telegram successfully');
      } catch (telegramError) {
        console.error('❌ Telegram error:', telegramError.response?.data || telegramError.message);
        // Don't fail the request if Telegram fails
      }
    } else {
      console.log('⚠️ Telegram not configured - skipping notification');
    }

    // Log the submission
    console.log('Contact form submission:', { name, email, message, telegramSent: telegramSuccess });

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully! We\'ll get back to you soon.',
        telegramSent: telegramSuccess
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
} 