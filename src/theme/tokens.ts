/**
 * Centralized Design Tokens
 * All colors, spacing, and design values used across the application
 * Change values here to update the entire application theme
 */

export const themeTokens = {
  colors: {
    brand: {
      sand: '#FAF3E1',
      dunes: '#F5E7C6',
      sunset: '#FF6D1F',
      ink: '#222222',
    },
    light: {
      background: {
        primary: '#FAF3E1',
        secondary: '#F5E7C6',
        card: '#F5E7C6',
        hover: '#FAF3E1',
      },
      text: {
        primary: '#222222',
        secondary: '#222222',
        tertiary: '#222222',
        muted: '#222222',
      },
      border: {
        default: '#F5E7C6',
        light: '#FAF3E1',
        dark: '#FF6D1F',
        card: 'rgba(235, 222, 201, 0.4)', // Main card borders - consistent across themes
        cardInner: 'rgba(235, 222, 201, 0.3)', // Inner elements (dividers, nested borders)
      },
      accent: {
        primary: '#FF6D1F',
        hover: '#FF6D1F',
        light: '#F5E7C6',
      },
    },
    dark: {
      background: {
        primary: '#222222',
        secondary: '#222222',
        card: '#222222',
        hover: '#FF6D1F',
      },
      text: {
        primary: '#FAF3E1',
        secondary: '#F5E7C6',
        tertiary: '#F5E7C6',
        muted: '#FAF3E1',
      },
      border: {
        default: '#222222',
        light: '#FF6D1F',
        dark: '#222222',
        card: 'rgba(235, 222, 201, 0.4)', // Main card borders - consistent across themes
        cardInner: 'rgba(235, 222, 201, 0.3)', // Inner elements (dividers, nested borders)
      },
      accent: {
        primary: '#FF6D1F',
        hover: '#FF6D1F',
        light: '#F5E7C6',
      },
    },
    shared: {
      success: '#FF6D1F',
      warning: '#FF6D1F',
      error: '#FF6D1F',
      info: '#F5E7C6',
    },
    footer: {
      background: '#222222',
      text: '#FAF3E1',
      textMuted: '#F5E7C6',
      border: '#222222',
      button: {
        primary: '#FF6D1F',
        primaryText: '#222222',
        secondary: '#F5E7C6',
        secondaryText: '#222222',
      },
    },
  },
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '3rem', // 48px
  },
  borderRadius: {
    sm: '0.5rem', // 8px
    md: '0.75rem', // 12px
    lg: '1rem', // 16px
    xl: '1.5rem', // 24px
    '2xl': '2rem', // 32px
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 20px 40px -10px rgba(0, 0, 0, 0.5)',
  },
} as const;

