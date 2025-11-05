/**
 * Application Configuration System
 *
 * SEPARATION:
 * - /config/instance.ts: Site configuration, theme, branding (admin-customizable)
 * - Environment Variables (.env): Only DATABASE_URI and PAYLOAD_SECRET
 * - /public/media/: Static assets (logos, background images)
 * - PayloadCMS Globals: UI text and labels only (dynamic content)
 */

import { config as instanceConfig } from '../../config/instance'

/**
 * Static Configuration
 * Loaded from /config/instance.ts and environment variables
 */
export interface StaticConfig {
  site: {
    name: string
    url: string
    timezone: string
  }
  theme: {
    colors: {
      brandPrimary: string
      textPrimary: string
      textSecondary: string
    }
    typography: {
      fontFamily: string | undefined
      fontUrl: string | undefined
    }
    backgrounds: {
      main: {
        type: 'color' | 'image'
        color: string
        image: string | undefined // filename in /public/media/
      }
      menu: {
        type: 'color' | 'image'
        color: string
        image: string | undefined // filename in /public/media/
      }
    }
  }
  branding: {
    logoDesktop: string // filename in /public/media/
    logoMobile: string // filename in /public/media/
    logoFooter: string // filename in /public/media/
  }
  i18n: {
    locales: string[]
    defaultLocale: string
  }
  secret: string
  database: {
    uri: string
  }
}

/**
 * Dynamic Configuration (from PayloadCMS)
 * Managed by admins via admin panel, can change anytime
 */
export interface DynamicConfig {
  ui: {
    menu: {
      eventsLabel: string
      artistsLabel: string
    }
    footer: {
      addEventText: string
      sendFeedbackText: string
    }
  }
}

/**
 * Complete application configuration
 */
export interface AppConfig extends StaticConfig {
  dynamic: DynamicConfig
}

/**
 * Load static configuration
 * Combines /config/instance.ts with environment variables
 * Throws error if required variables are missing
 */
export function loadStaticConfig(): StaticConfig {
  // Validate required environment variables
  const databaseUri = process.env.DATABASE_URI
  const secret = process.env.PAYLOAD_SECRET

  if (!databaseUri) {
    throw new Error(
      'Missing required environment variable: DATABASE_URI. Please check your .env file.',
    )
  }

  if (!secret) {
    throw new Error(
      'Missing required environment variable: PAYLOAD_SECRET. Please check your .env file.',
    )
  }

  return {
    site: {
      name: instanceConfig.site.name,
      url: instanceConfig.site.url,
      timezone: instanceConfig.site.timezone,
    },
    theme: {
      colors: {
        brandPrimary: instanceConfig.theme.brandColor,
        textPrimary: instanceConfig.theme.textPrimary,
        textSecondary: instanceConfig.theme.textSecondary,
      },
      typography: {
        fontFamily: instanceConfig.theme.fontFamily,
        fontUrl: instanceConfig.theme.fontUrl,
      },
      backgrounds: {
        main: {
          type: instanceConfig.theme.mainBgType,
          color: instanceConfig.theme.mainBgColor,
          image: instanceConfig.theme.mainBgImage,
        },
        menu: {
          type: instanceConfig.theme.menuBgType,
          color: instanceConfig.theme.menuBgColor,
          image: instanceConfig.theme.menuBgImage,
        },
      },
    },
    branding: {
      logoDesktop: instanceConfig.branding.logoDesktop,
      logoMobile: instanceConfig.branding.logoMobile,
      logoFooter: instanceConfig.branding.logoFooter,
    },
    i18n: {
      locales: [...instanceConfig.i18n.locales],
      defaultLocale: instanceConfig.i18n.defaultLocale,
    },
    secret,
    database: {
      uri: databaseUri,
    },
  }
}

/**
 * Load dynamic configuration from PayloadCMS
 * Must be called in Server Components
 * Loads only UI text and labels
 */
export async function loadDynamicConfig(): Promise<DynamicConfig> {
  try {
    const { getPayload } = await import('payload')
    const configPromise = import('@/payload.config')
    const config = await configPromise
    const payload = await getPayload({ config: config.default })

    const dbConfig = await payload.findGlobal({
      slug: 'site-config',
      depth: 0, // No need for deep population, just text fields
    })

    // Validate required fields exist
    if (!dbConfig) {
      throw new Error(
        'Site configuration not found in PayloadCMS. Please configure it in the admin panel.',
      )
    }

    return {
      ui: {
        menu: {
          eventsLabel: dbConfig.menuLabels?.events || 'Events',
          artistsLabel: dbConfig.menuLabels?.artists || 'Artists',
        },
        footer: {
          addEventText: dbConfig.footerText?.addEvent || 'Add Event',
          sendFeedbackText: dbConfig.footerText?.sendFeedback || 'Send Feedback',
        },
      },
    }
  } catch (error) {
    throw new Error(
      `Failed to load dynamic configuration from PayloadCMS: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

/**
 * Load complete application configuration
 * Call this in Server Components that need both static and dynamic config
 */
export async function loadAppConfig(): Promise<AppConfig> {
  const staticConfig = loadStaticConfig()
  const dynamicConfig = await loadDynamicConfig()

  return {
    ...staticConfig,
    dynamic: dynamicConfig,
  }
}

/**
 * Get static configuration synchronously (for Client Components)
 * Only includes environment-based configuration
 */
export function getStaticConfig(): StaticConfig {
  return loadStaticConfig()
}

/**
 * Helper functions
 */
export function getTimezone(config: StaticConfig): string {
  return config.site.timezone
}

export function getSiteUrl(config: StaticConfig): string {
  return config.site.url
}
