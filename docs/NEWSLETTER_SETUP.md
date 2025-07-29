# Newsletter Signup Feature Setup

This document outlines the setup required for the newsletter signup feature on the News project card.

## Features

- Email validation and submission
- Supabase database storage
- Telegram notifications
- Mobile-responsive design
- Submission animations and feedback

## Environment Variables Required

Add the following environment variables to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Telegram Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
```

## Database Setup

1. Run the SQL script in `docs/NEWSLETTER_TABLE.sql` in your Supabase SQL editor
2. This will create the `newsletter_subscribers` table with proper indexing and security policies

## API Endpoint

The newsletter signup API is located at `/api/newsletter-signup` and handles:

- Email validation
- Duplicate email checking
- Database insertion
- Telegram notifications
- Error handling

## Component Structure

- `NewsletterSignup.js` - Main component with form and animations
- `NewsletterSignup.module.css` - Mobile-responsive styling
- The component is automatically used when the News project (id: 4) is selected

## Features

### Form Validation
- Email format validation
- Duplicate email prevention
- Real-time error feedback

### Animations
- Loading spinner during submission
- Success/error message animations
- Input field shake animation for errors
- Floating icon animation

### Mobile Responsive
- Responsive design for all screen sizes
- Touch-friendly input and buttons
- Optimized spacing for mobile devices

### Security
- Server-side email validation
- Supabase RLS policies
- Environment variable protection
- Error handling without exposing sensitive data

## Testing

1. Navigate to the News project card
2. Enter a valid email address
3. Submit the form
4. Check for success message
5. Verify email appears in Supabase database
6. Check Telegram for notification

## Troubleshooting

### Common Issues

1. **Email not saving to database**
   - Check Supabase service role key
   - Verify table exists and RLS policies are correct

2. **Telegram notifications not working**
   - Verify bot token and chat ID
   - Check bot permissions

3. **Form not submitting**
   - Check browser console for errors
   - Verify API route is accessible

4. **Styling issues on mobile**
   - Clear browser cache
   - Check CSS module compilation 