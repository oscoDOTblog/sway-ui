export const colors = {
  // Primary gradients
  primaryGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  primaryGradientReverse: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
  
  // Accent gradients
  accentGradient: 'linear-gradient(45deg, #00ff88, #00ccff)',
  accentGradientReverse: 'linear-gradient(45deg, #00ccff, #00ff88)',
  
  // Text gradients
  textGradient: 'linear-gradient(45deg, #ffffff, #00ff88)',
  textGradientReverse: 'linear-gradient(45deg, #00ff88, #ffffff)',
  
  // Overlay gradients
  overlayGradient: 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 50%, rgba(0, 0, 0, 0.6) 100%)',
  overlayGradientLight: 'linear-gradient(135deg, rgba(102, 126, 234, 0.6) 0%, rgba(118, 75, 162, 0.6) 100%)',
  
  // Sidebar gradients
  sidebarGradient: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
  
  // Individual colors for reference
  primary: {
    purple: '#667eea',
    darkPurple: '#764ba2',
    green: '#00ff88',
    blue: '#00ccff',
    dark: '#1a1a2e',
    darker: '#16213e'
  },
  
  // Opacity variations
  overlay: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.2)',
    dark: 'rgba(0, 0, 0, 0.2)',
    accent: 'rgba(0, 255, 136, 0.2)',
    accentMedium: 'rgba(0, 255, 136, 0.3)',
    accentDark: 'rgba(0, 255, 136, 0.4)'
  },
  
  // Text colors
  text: {
    white: '#ffffff',
    lightGray: 'rgba(255, 255, 255, 0.6)',
    mediumGray: 'rgba(255, 255, 255, 0.7)',
    darkGray: 'rgba(255, 255, 255, 0.5)'
  }
};

// Theme configuration
export const theme = {
  gradients: colors,
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '20px',
    xlarge: '50px'
  },
  shadows: {
    light: '0 5px 15px rgba(0, 255, 136, 0.3)',
    medium: '0 10px 30px rgba(0, 255, 136, 0.3)',
    heavy: '0 20px 40px rgba(0, 0, 0, 0.3)'
  },
  transitions: {
    fast: 'all 0.2s ease',
    medium: 'all 0.3s ease',
    slow: 'all 0.5s ease'
  }
};

export default colors; 