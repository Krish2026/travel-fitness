export const theme = {
  // Colors
  colors: {
    // Primary
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    
    // Status
    success: '#29b365',
    error: '#FF6B6B',
    warning: '#FFA500',
    info: '#45B7D1',
    
    // Neutral
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#1F1F1F',
    textSecondary: '#808080',
    textTertiary: '#B0B0B0',
    border: '#E0E0E0',
    divider: '#F0F0F0',
    
    // Legacy colors (kept for compatibility)
    colorGreen: '#29b365',
    colorWhite: '#fff',
    colorLeafyGreen: '#206a42',
    colorAppleGreen: '#a0d36c',
    colorLimeGreen: '#d0e57e',
    colorLightGrey: '#eee',
    colorBlack: '#000',
    colorGrey: '#808080',
  },
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  
  // Typography
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 38,
    },
    h2: {
      fontSize: 28,
      fontWeight: '700' as const,
      lineHeight: 34,
    },
    h3: {
      fontSize: 24,
      fontWeight: '700' as const,
      lineHeight: 30,
    },
    h4: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 26,
    },
    h5: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 24,
    },
    body: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    bodyBold: {
      fontSize: 14,
      fontWeight: '600' as const,
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
    },
    captionBold: {
      fontSize: 12,
      fontWeight: '600' as const,
      lineHeight: 16,
    },
  },
  
  // Border radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  
  // Shadow (for web/ios)
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
  },
};
