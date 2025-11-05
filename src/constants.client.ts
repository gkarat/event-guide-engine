/**
 * Client-safe constants that can be imported in Client Components
 * Uses static configuration from /config/index.ts
 */

import { loadStaticConfig } from './config'

const config = loadStaticConfig()

// URL configuration for different environments
export const URLS = {
  // External website URLs
  WEBSITE: config.site.url,
  ADD_EVENT: '/events/add',
  FEEDBACK: '/feedback',

  // Internal application routes
  HOME: '/', // Internal route to homepage
} as const
