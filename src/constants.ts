import { loadStaticConfig } from './config'

const config = loadStaticConfig()

// Website URL configuration
export const WEBSITE_URL = config.site.url

// URL configuration for different environments
export const URLS = {
  // External website URLs
  WEBSITE: WEBSITE_URL,
  ADD_EVENT: '/events/add',
  FEEDBACK: '/feedback',

  // Internal application routes
  HOME: '/', // Internal route to homepage
} as const
