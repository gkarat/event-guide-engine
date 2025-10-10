import { loadStaticConfig } from './config'

export const hasSmtpSet = true
/*   process.env.SMTP_HOST &&
  process.env.SMTP_PORT &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASSWORD
 */

const config = loadStaticConfig()

// Website URL configuration
export const WEBSITE_URL = config.site.url

// URL configuration for different environments
export const URLS = {
  // External website URLs
  WEBSITE: WEBSITE_URL,
  ADD_EVENT: '/events/add',
  FEEDBACK: '#', // TODO: Update when feedback functionality is implemented

  // Internal application routes
  HOME: '/', // Internal route to homepage
} as const
