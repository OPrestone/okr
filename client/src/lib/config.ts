// Configuration settings for the application

// API configuration
export const API_CONFIG = {
  // Base URL for the external API - can be overridden with environment variables
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
  
  // Default headers to include with API requests
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    // You can add default headers like API keys here
  },
  
  // Whether to use mock data instead of making real API calls
  // In a real app, this would be controlled by environment variables
  USE_MOCK_DATA: true, // Set to true to use mock data by default
  
  // Authentication settings
  AUTH: {
    // The storage key for auth tokens
    TOKEN_KEY: 'okr_system_auth_token',
    
    // Whether to include authentication for all requests
    INCLUDE_AUTH: true,
    
    // The header name for the auth token
    AUTH_HEADER: 'Authorization',
    
    // The auth token prefix (e.g., "Bearer ")
    TOKEN_PREFIX: 'Bearer ',
  }
};

// Feature flags
export const FEATURES = {
  // Enable/disable features as needed
  AI_SUGGESTIONS: true,
  GOOGLE_MEET_INTEGRATION: true,
  REPORTING: true,
};

// UI configuration
export const UI_CONFIG = {
  // Theme settings
  THEME: {
    DEFAULT_THEME: 'system', // 'light', 'dark', or 'system'
    SAVE_TO_LOCAL_STORAGE: true,
  },
  
  // Default pagination settings
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
  },
};

export default {
  API: API_CONFIG,
  FEATURES,
  UI: UI_CONFIG,
};