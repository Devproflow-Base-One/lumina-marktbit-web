/**
 * WHITE-LABEL BRANDING CONFIGURATION
 * Centralized branding configuration for white-label deployment
 */

export interface BrandingConfig {
  // Application Identity
  appName: string
  company: string
  tagline: string

  // Visual Branding
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string

  // Logo & Icons
  logoUrl?: string
  faviconUrl?: string
  iconPack: string

  // Metadata
  title: string
  description: string
  author: string

  // Contact & Support
  supportEmail: string
  supportPhone?: string
  websiteUrl?: string

  // Legal
  copyright: string
  privacyPolicyUrl?: string
  termsOfServiceUrl?: string

  // Feature Flags
  enableWhiteLabel: boolean
  showBranding: boolean
  allowCustomLogo: boolean
}

// Default MarktBit Branding
export const defaultBranding: BrandingConfig = {
  appName: 'LUMINA MARKTBIT',
  company: 'Lumina Technologies',
  tagline: 'Hybrid Crypto & Global Stock Signal Intelligence',

  primaryColor: '#eab308', // Yellow
  secondaryColor: '#1f2937', // Dark Gray
  accentColor: '#22c55e', // Green
  backgroundColor: '#000000', // Black
  textColor: '#f3f4f6', // Light Gray

  iconPack: 'lucide-react',

  title: 'MarktBit - Crypto & Stock Signal Intelligence',
  description: 'Hybrid crypto and global stock market signal intelligence platform',
  author: 'Lumina Technologies',

  supportEmail: 'support@marktbit.app',
  websiteUrl: 'https://marktbit.app',

  copyright: '© 2026 Lumina Technologies. All rights reserved.',

  enableWhiteLabel: false,
  showBranding: true,
  allowCustomLogo: true,
}

// White-Label Client Configurations (Examples)
export const clientBrandingExamples = {
  // Example: Crypto-only deployment
  cryptoOnly: {
    ...defaultBranding,
    appName: 'MarktBit Crypto',
    company: 'Lumina Technologies',
    tagline: 'Crypto Signal Intelligence',

    primaryColor: '#eab308', // Yellow
    secondaryColor: '#ca8a04', // Dark Yellow
    accentColor: '#fbbf24', // Amber

    title: 'MarktBit Crypto - Signal Intelligence',
    description: 'AI-powered cryptocurrency signal intelligence platform',
    author: 'Lumina Technologies',

    supportEmail: 'support@marktbit.app',
    websiteUrl: 'https://crypto.marktbit.com',

    copyright: '© 2026 Lumina Technologies. All rights reserved.',

    enableWhiteLabel: true,
    showBranding: true,
    allowCustomLogo: true,
  },

  // Example: Stocks-only deployment
  stocksOnly: {
    ...defaultBranding,
    appName: 'MarktBit Stocks',
    company: 'Lumina Technologies',
    tagline: 'Global Stock Signal Intelligence',

    primaryColor: '#22c55e', // Green
    secondaryColor: '#16a34a', // Dark Green
    accentColor: '#4ade80', // Light Green

    title: 'MarktBit Stocks - Signal Intelligence',
    description: 'AI-powered global stock market signal intelligence platform',
    author: 'Lumina Technologies',

    supportEmail: 'support@marktbit.app',
    websiteUrl: 'https://stocks.marktbit.com',

    copyright: '© 2026 Lumina Technologies. All rights reserved.',

    enableWhiteLabel: true,
    showBranding: true,
    allowCustomLogo: true,
  },
}

// Dynamic Branding Loader
export function getBrandingConfig(): BrandingConfig {
  // In production, this would load from SystemConfig or environment variables
  // For now, we'll use environment variables with fallback to default

  if (typeof window !== 'undefined') {
    // Client-side: Load from window or API
    const windowBranding = (window as any).__BRANDING_CONFIG__
    if (windowBranding) {
      return windowBranding
    }
  }

  // Server-side or fallback: Check environment variables
  const envBranding: Partial<BrandingConfig> = {
    appName: process.env.NEXT_PUBLIC_APP_NAME || defaultBranding.appName,
    company: process.env.NEXT_PUBLIC_COMPANY_NAME || defaultBranding.company,
    tagline: process.env.NEXT_PUBLIC_TAGLINE || defaultBranding.tagline,

    primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || defaultBranding.primaryColor,
    secondaryColor: process.env.NEXT_PUBLIC_SECONDARY_COLOR || defaultBranding.secondaryColor,
    accentColor: process.env.NEXT_PUBLIC_ACCENT_COLOR || defaultBranding.accentColor,

    title: process.env.NEXT_PUBLIC_APP_TITLE || defaultBranding.title,
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || defaultBranding.description,
    author: process.env.NEXT_PUBLIC_APP_AUTHOR || defaultBranding.author,

    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || defaultBranding.supportEmail,
    websiteUrl: process.env.NEXT_PUBLIC_WEBSITE_URL || defaultBranding.websiteUrl,

    copyright: process.env.NEXT_PUBLIC_COPYRIGHT || defaultBranding.copyright,

    enableWhiteLabel: process.env.NEXT_PUBLIC_ENABLE_WHITE_LABEL === 'true',
    showBranding: process.env.NEXT_PUBLIC_SHOW_BRANDING !== 'false',
    allowCustomLogo: process.env.NEXT_PUBLIC_ALLOW_CUSTOM_LOGO !== 'false',
  }

  return { ...defaultBranding, ...envBranding }
}

// CSS Variables Generator
export function generateCSSVariables(branding: BrandingConfig): string {
  return `
    :root {
      --color-primary: ${branding.primaryColor};
      --color-secondary: ${branding.secondaryColor};
      --color-accent: ${branding.accentColor};
      --color-background: ${branding.backgroundColor};
      --color-text: ${branding.textColor};
      
      --app-name: "${branding.appName}";
      --company-name: "${branding.company}";
      --tagline: "${branding.tagline}";
    }
  `
}

// Tailwind CSS Config Generator
export function generateTailwindConfig(branding: BrandingConfig) {
  return {
    theme: {
      extend: {
        colors: {
          primary: branding.primaryColor,
          secondary: branding.secondaryColor,
          accent: branding.accentColor,
          background: branding.backgroundColor,
          text: branding.textColor,
        },
        fontFamily: {
          brand: ['Inter', 'sans-serif'],
        },
      },
    },
  }
}
