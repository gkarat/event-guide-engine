export const hasSmtpSet = true
/*   process.env.SMTP_HOST &&
  process.env.SMTP_PORT &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASSWORD
 */

// Website URL configuration
export const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL

// URL configuration for different environments
export const URLS = {
  // External website URLs
  WEBSITE: WEBSITE_URL,
  ADD_EVENT: '#', // TODO: Update when event submission is implemented
  FEEDBACK: '#', // TODO: Update when feedback functionality is implemented

  // Internal application routes
  HOME: '/', // Internal route to homepage
} as const
