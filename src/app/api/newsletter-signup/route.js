import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

// Initialize Supabase client with error handling
let supabase = null;
try {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (supabaseUrl && supabaseServiceKey) {
    supabase = createClient(supabaseUrl, supabaseServiceKey);
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
}

// Telegram configuration with better debugging
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_API = TELEGRAM_BOT_TOKEN ? `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}` : null;

// Debug Telegram configuration
console.log('Telegram Configuration Debug:');
console.log('- TELEGRAM_BOT_TOKEN exists:', !!TELEGRAM_BOT_TOKEN);
console.log('- TELEGRAM_CHAT_ID exists:', !!TELEGRAM_CHAT_ID);
console.log('- TELEGRAM_CHAT_ID value:', TELEGRAM_CHAT_ID);
console.log('- TELEGRAM_API exists:', !!TELEGRAM_API);

export async function POST(request) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ success: false, message: 'Valid email is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if Supabase is configured
    if (!supabase) {
      console.error('Supabase not configured');
      return new Response(
        JSON.stringify({ success: false, message: 'Database not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if email already exists in Supabase
    const { data: existingEmail } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('email', email)
      .single();

    if (existingEmail) {
      return new Response(
        JSON.stringify({ success: false, message: 'Email already subscribed' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Insert email into Supabase
    const { error: supabaseError } = await supabase
      .from('newsletter_subscribers')
      .insert([
        {
          email: email,
          subscribed_at: new Date().toISOString(),
          source: 'sway-ui'
        }
      ]);

    if (supabaseError) {
      console.error('Supabase error:', supabaseError);
      return new Response(
        JSON.stringify({ success: false, message: 'Database error occurred' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Send Telegram notification with improved debugging
    let telegramSuccess = false;
    if (TELEGRAM_API && TELEGRAM_CHAT_ID) {
      try {
        console.log('Attempting to send Telegram notification...');
        console.log('- API URL:', TELEGRAM_API);
        console.log('- Chat ID:', TELEGRAM_CHAT_ID);
        
        const telegramResponse = await axios.post(`${TELEGRAM_API}/sendMessage`, {
          chat_id: TELEGRAM_CHAT_ID,
          text: `🎉 New newsletter signup!\nEmail: ${email}\nSource: sway-ui`
        });
        
        console.log('Telegram response:', telegramResponse.data);
        telegramSuccess = true;
        console.log('✅ Telegram notification sent successfully');
      } catch (telegramError) {
        console.error('❌ Telegram error:', telegramError.response?.data || telegramError.message);
        console.error('Telegram error details:', {
          status: telegramError.response?.status,
          statusText: telegramError.response?.statusText,
          data: telegramError.response?.data
        });
        // Don't fail the request if Telegram fails
      }
    } else {
      console.log('⚠️ Telegram not configured - skipping notification');
      console.log('- TELEGRAM_API:', TELEGRAM_API);
      console.log('- TELEGRAM_CHAT_ID:', TELEGRAM_CHAT_ID);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Successfully subscribed!',
        telegramSent: telegramSuccess
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Newsletter signup error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 