# Dance Central Character System

## Overview

The Sway Quest blog now features a character-driven content system inspired by the Dance Central video game series. Instead of generic "Sway Team" posts, each blog post is written by one of seven distinct characters, each with their own unique personality, tone, and writing style.

## Characters

### 1. Emilia - The Cheerleader / Pop Princess
- **Tone**: Peppy, encouraging, full of sparkle
- **Writing Style**: Enthusiastic, encouraging, uses lots of exclamation marks, bubbly and positive
- **Personality**: Energetic cheerleader who sees potential in everyone
- **Catchphrases**: 
  - "Yes! That's it, superstar!"
  - "Shine brighter, don't be shy!"
  - "One more time — with extra sparkle."

### 2. Mo - The Smooth Operator / R&B Cool
- **Tone**: Laid-back, confident, smooth-talker
- **Writing Style**: Smooth, flowing, confident, uses longer sentences, chill and relaxed
- **Personality**: Cool and collected mentor who emphasizes flow and groove
- **Catchphrases**:
  - "Relax. The beat's already in you."
  - "Don't force it — let it flow."
  - "Smooth, clean, unstoppable."

### 3. Dare - The Cocky Showman
- **Tone**: Bold, cocky, always challenging
- **Writing Style**: Bold, challenging, uses short punchy sentences, confident and demanding
- **Personality**: Confident showman who pushes dancers to their limits
- **Catchphrases**:
  - "That all you got? Show me the real you!"
  - "Go big or go home!"
  - "Stick the landing — or don't even bother."

### 4. Angel - The Edgy Rebel / Punk Attitude
- **Tone**: Sharp, rebellious, witty
- **Writing Style**: Edgy, sarcastic, rebellious, uses attitude and wit, honest but encouraging
- **Personality**: Rebellious spirit who values authenticity and raw energy
- **Catchphrases**:
  - "Messy? Yeah. But I've seen worse."
  - "Make it raw, make it real."
  - "If you fall, fall loud."

### 5. Oblio - The Mysterious Rival
- **Tone**: Calm, enigmatic, mentor-like
- **Writing Style**: Poetic, philosophical, uses metaphors, mysterious and profound
- **Personality**: Enigmatic mentor who focuses on artistry and presence
- **Catchphrases**:
  - "Your steps are loud, but your silence is louder."
  - "Control the air around you."
  - "Dance as if the world is watching."

### 6. Bodie - The Energetic Bro / Party Starter
- **Tone**: Fun, sporty, hype like a big brother
- **Writing Style**: Energetic, casual, uses slang and hype words, friendly and encouraging
- **Personality**: Energetic big brother who makes everything feel like a party
- **Catchphrases**:
  - "Bro, that was fire!"
  - "C'mon, louder steps, bigger moves!"
  - "Don't think — just vibe!"

### 7. Glitch & Katalina - The DJ Duo
- **Tone**: Fast, fun, chaotic duo banter
- **Writing Style**: Dynamic, playful, uses duo commentary style, energetic and fun
- **Personality**: Dynamic DJ duo who bring constant energy and playful commentary
- **Catchphrases**:
  - "Oof, busted that move — but I liked it!"
  - "Yeah, messy, but kinda spicy!"
  - "One more time — remix edition!"

## How It Works

### Character Assignment
- **New Posts**: Each new blog post is automatically assigned a random character (or a specific character if chosen)
- **Existing Posts**: Posts previously written by "Sway Team" can be updated to use characters via the migration script

### Content Generation
- The AI generates content using character-specific prompts that include:
  - Character's unique writing style and tone
  - Personality traits and characteristics
  - Signature catchphrases to use naturally
  - Character-specific feedback style

### Display
- Blog posts show both the character name as the author and the character type
- Character information is displayed with special styling on blog pages
- Admin interface shows character selection and preview

## Technical Implementation

### Configuration
The character system is configured in `src/config/blogConfig.js`:

```javascript
characters: {
  emilia: {
    name: "Emilia",
    title: "The Cheerleader / Pop Princess",
    tone: "peppy, encouraging, full of sparkle",
    // ... more properties
  },
  // ... other characters
}
```

### Helper Functions
- `getRandomCharacter()` - Selects a random character
- `getCharacterByDate(date)` - Selects character based on date (for consistency)
- `getCharacterInfo(key)` - Gets character information
- `getAllCharacterNames()` - Gets all character names

### Database Schema
Blog posts now include:
- `author`: Character name (e.g., "Emilia")
- `character`: Character key (e.g., "emilia")

### API Endpoints
- `GET /api/blog/generate` - Returns available characters
- `POST /api/blog/generate` - Accepts `character` parameter for specific character

## Usage

### Admin Interface
1. Go to the admin blog generator
2. Select a specific character (optional - random if not selected)
3. Generate posts with character-specific content

### Programmatic Usage
```javascript
// Generate with random character
const result = await fetch('/api/blog/generate', {
  method: 'POST',
  body: JSON.stringify({ topic: 'Dance Tips', count: 1 })
});

// Generate with specific character
const result = await fetch('/api/blog/generate', {
  method: 'POST',
  body: JSON.stringify({ 
    topic: 'Dance Tips', 
    count: 1, 
    character: 'emilia' 
  })
});
```

### Migration Script
To update existing posts:
```bash
node scripts/update-blog-characters.js
```

## Benefits

1. **Engaging Content**: Each character brings a unique voice and perspective
2. **Variety**: Different writing styles keep content fresh and interesting
3. **Personality**: Readers can connect with characters they relate to
4. **Consistency**: Date-based character selection ensures predictable variety
5. **Scalability**: Easy to add new characters or modify existing ones

## Future Enhancements

- Character-specific profile images
- Character-based content categories
- Reader character preferences
- Character interaction in comments
- Character-specific social media posts

## Testing

Run the character system tests:
```bash
node scripts/test-character-generation.js
```

This will verify:
- Character configuration
- Helper functions
- Prompt generation
- Character validation
- Distribution algorithms
