# Styling Guide

## Color Palette

### Hot Pink Colors

The application uses a consistent hot pink color scheme throughout:

**Primary Hot Pink: `#ff1493` (Deep Pink)**
- Used for borders, text highlights, focus states, and primary interactive elements
- Hex: `#ff1493`
- CSS Color Name: `Deep Pink`

**Secondary Hot Pink: `#ff69b4` (Hot Pink)**
- Used in gradients and as a complementary shade
- Hex: `#ff69b4`
- CSS Color Name: `Hot Pink`

## Usage Patterns

### Focus States
```css
button:focus,
a:focus {
  outline: 2px solid #ff1493;
  outline-offset: 2px;
}
```

### Borders
```css
border-top: 3px solid #ff1493;
border: 3px solid #ff1493;
border-color: #ff1493;
```

### Backgrounds
```css
/* Solid backgrounds */
background: #ff1493;

/* Gradients */
background: linear-gradient(45deg, #fff, #ff1493);
background: linear-gradient(45deg, #ff1493, #ff69b4);
```

### Text Colors
```css
color: #ff1493;
```

### Interactive Elements
- Buttons and form elements use hot pink for hover and active states
- Navigation elements highlight with hot pink
- Form validation and success states use hot pink

## Files Using Hot Pink Colors

- `src/app/globals.css` - Focus states
- `src/app/page.module.css` - Borders, backgrounds, gradients
- `src/app/components/PersonaMenu.module.css` - Extensive use for interactive elements
- `src/app/contact/page.module.css` - Form styling and gradients
- `src/app/components/Header.module.css` - Navigation highlights
- `src/app/components/AnimatedForm.module.css` - Form styling
- `src/app/components/PersonaMenu.js` - Dynamic styling based on state

## Design Philosophy

The hot pink color scheme creates a bold, modern aesthetic that:
- Provides excellent contrast against dark backgrounds
- Creates visual hierarchy and emphasis
- Maintains accessibility with proper contrast ratios
- Establishes brand consistency across all components

## Accessibility Notes

- Hot pink focus states ensure keyboard navigation is clearly visible
- Color combinations maintain WCAG contrast requirements
- Focus outlines use `outline-offset` for better visibility