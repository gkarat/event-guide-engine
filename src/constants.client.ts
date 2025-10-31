/**
 * Client-safe constants that can be imported in Client Components
 * Only uses NEXT_PUBLIC_* environment variables
 */

// Website URL configuration
export const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL || ''

// URL configuration for different environments
export const URLS = {
  // External website URLs
  WEBSITE: WEBSITE_URL,
  ADD_EVENT: '/events/add',
  FEEDBACK: '/feedback',

  // Internal application routes
  HOME: '/', // Internal route to homepage
} as const
