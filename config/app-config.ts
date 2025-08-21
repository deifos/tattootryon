/**
 * Application Configuration
 *
 * Centralized configuration for TattooTraceAI application.
 * All hardcoded values should be defined here for easy maintenance.
 */

// Credits and Pricing Configuration
export const CREDITS_CONFIG = {
  // Cost per image generation
  COST_PER_GENERATION: 1,

  // Free credits for new users
  FREE_CREDITS_PER_USER: 3,

  // Default generation settings
  DEFAULT_NUM_IMAGES: 1,
  DEFAULT_IMAGE_SIZE: 'square_hd' as const,

  // Credit package (price in cents)
  PACKAGE: {
    CRAZY_INK_PACK: {
      credits: 50,
      price: 2000, // $20.00
      pricePerImage: 0.4,
    },
  },
} as const;

// API Configuration
export const API_CONFIG = {
  // Internal API endpoints
  ENDPOINTS: {
    FAL_PROXY: '/api/fal/proxy',
    RECORD_GENERATION: '/api/record-generation',
    STRIPE_CHECKOUT: '/api/stripe/create-checkout-session',
    STRIPE_WEBHOOK: '/api/stripe/webhook',
  },

  // External services
  EXTERNAL: {
    FAL_AI_URL: 'https://fal.ai',
  },
} as const;

// UI Configuration
export const UI_CONFIG = {
  // Canvas settings for tattoo overlay
  CANVAS: {
    DEFAULT_WIDTH: 800,
    DEFAULT_HEIGHT: 600,
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  },

  // Gallery settings
  GRID_COLUMNS: {
    mobile: 1,
    tablet: 2,
    desktop: 3,
  },
} as const;

// Business Configuration
export const BUSINESS_CONFIG = {
  // Company information
  COMPANY_NAME: 'TattooTraceAI',
  SUPPORT_EMAIL: 'support@tattootraceai.com',

  // Branding
  TAGLINES: {
    MAIN: 'See Your Tattoo Before You Ink',
    PRICING: 'One-time payment • No subscriptions',
  },

  // Legal
  REFUND_POLICY: 'No refunds due to computational costs',
  TERMS_VERSION: '2024-08-21',
} as const;

// Development Configuration
export const DEV_CONFIG = {
  // Default values for development
  DEFAULT_APP_URL: 'http://localhost:3000',

  // Debug settings
  ENABLE_CONSOLE_LOGS: process.env.NODE_ENV === 'development',
} as const;

// Export all configs as a single object for convenience
export const APP_CONFIG = {
  CREDITS: CREDITS_CONFIG,
  API: API_CONFIG,
  UI: UI_CONFIG,
  BUSINESS: BUSINESS_CONFIG,
  DEV: DEV_CONFIG,
} as const;

// Type exports for better TypeScript support
export type ApiEndpoint = keyof typeof API_CONFIG.ENDPOINTS;
