import { colors, theme } from '../config/colors';

// Utility function to get CSS custom property value
export const getCSSVariable = (variableName) => {
  if (typeof window !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName);
  }
  return null;
};

// Utility function to set CSS custom property value
export const setCSSVariable = (variableName, value) => {
  if (typeof window !== 'undefined') {
    document.documentElement.style.setProperty(variableName, value);
  }
};

// Export colors and theme for use in components
export { colors, theme };

// Common gradient utilities
export const gradients = {
  primary: colors.primaryGradient,
  accent: colors.accentGradient,
  text: colors.textGradient,
  sidebar: colors.sidebarGradient,
  overlay: colors.overlayGradient
};

// Color utilities for dynamic theming
export const updateTheme = (newColors) => {
  Object.entries(newColors).forEach(([key, value]) => {
    setCSSVariable(`--${key}`, value);
  });
}; 