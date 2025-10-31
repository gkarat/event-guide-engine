/**
 * Application Configuration System
 *
 * STRICT SEPARATION:
 * - Environment Variables: Site info, colors, fonts, locales (deployment config)
 * - PayloadCMS Globals: Logos, images, UI text (admin-managed content)
 *
 * No fallbacks - configuration must be properly set in both places.
 */

import type { Media } from '@/payload-types'

/**
 * Static Configuration (from environment variables)
 * Set once at deployment, rarely changes
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
      fontFamily: string
      fontUrl: string | null
    }
    backgrounds: {
      main: {
        type: 'color' | 'image'
        value: string // Hex color OR path to image in PayloadCMS
      }
      menu: {
        type: 'color' | 'image'
        value: string // Hex color OR path to image in PayloadCMS
      }
    }
  }
  i18n: {
    locales: string[]
    defaultLocale: string
  }
}

/**
 * Dynamic Configuration (from PayloadCMS)
 * Managed by admins, can change anytime
 */
export interface DynamicConfig {
  branding: {
    logoDesktop: string
    logoMobile: string
    logoFooter: string
  }
  backgrounds: {
    mainImage: string | null
    menuImage: string | null
  }
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
 * Load static configuration from environment variables
 * Throws error if required variables are missing
 */
export function loadStaticConfig(): StaticConfig {
  // TODO: refine the fallback values and check the build behavior
  const required = {
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Event Guide App',
    siteUrl: process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://localhost:3000',
    brandColor: process.env.NEXT_PUBLIC_BRAND_COLOR || '#FF0000',
    textPrimary: process.env.NEXT_PUBLIC_TEXT_PRIMARY || '#1A1A1A',
    textSecondary: process.env.NEXT_PUBLIC_TEXT_SECONDARY || '#313131',
    fontFamily: process.env.NEXT_PUBLIC_FONT_FAMILY || 'sans-serif',
  }

  // Validate required fields
  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
        'Please check your .env file.',
    )
  }

  return {
    site: {
      name: required.siteName!,
      url: required.siteUrl!,
      timezone: process.env.NEXT_PUBLIC_TIMEZONE || 'UTC',
    },
    theme: {
      colors: {
        brandPrimary: required.brandColor!,
        textPrimary: required.textPrimary!,
        textSecondary: required.textSecondary!,
      },
      typography: {
        fontFamily: required.fontFamily!,
        fontUrl: process.env.NEXT_PUBLIC_FONT_URL || null,
      },
      backgrounds: {
        main: {
          type: process.env.NEXT_PUBLIC_BACKGROUND_MAIN_TYPE === 'image' ? 'image' : 'color',
          value: process.env.NEXT_PUBLIC_BACKGROUND_MAIN_VALUE || '#141414',
        },
        menu: {
          type: process.env.NEXT_PUBLIC_BACKGROUND_MENU_TYPE === 'image' ? 'image' : 'color',
          value: process.env.NEXT_PUBLIC_BACKGROUND_MENU_VALUE || '#1a1a1a',
        },
      },
    },
    i18n: {
      locales: process.env.CONTENT_LOCALES?.split(',').map((l) => l.trim()) || ['en'],
      defaultLocale: process.env.DEFAULT_CONTENT_LOCALE || 'en',
    },
  }
}

/**
 * Helper to get media URL from PayloadCMS media object
 */
function getMediaUrl(media: Media | number | string | null | undefined): string {
  if (!media) {
    throw new Error('Media object is required but was not provided')
  }
  if (typeof media === 'string') return media
  if (typeof media === 'number') {
    throw new Error('Media ID received instead of populated object. Ensure depth is set correctly.')
  }
  if (!media.url) {
    throw new Error('Media object does not have a URL')
  }
  return media.url
}

/**
 * Load dynamic configuration from PayloadCMS
 * Must be called in Server Components
 * Throws error if site-config global doesn't exist or is incomplete
 */
export async function loadDynamicConfig(): Promise<DynamicConfig> {
  try {
    const { getPayload } = await import('payload')
    const configPromise = import('@/payload.config')
    const config = await configPromise
    const payload = await getPayload({ config: config.default })

    const dbConfig = await payload.findGlobal({
      slug: 'site-config',
      depth: 1,
    })

    // Validate required fields exist
    if (!dbConfig) {
      throw new Error(
        'Site configuration not found in PayloadCMS. Please configure it in the admin panel.',
      )
    }

    if (!dbConfig.logoDesktop || !dbConfig.logoMobile || !dbConfig.logoFooter) {
      throw new Error(
        'All logo images are required in site-config. Please upload them in the admin panel.',
      )
    }

    return {
      branding: {
        logoDesktop: getMediaUrl(dbConfig.logoDesktop),
        logoMobile: getMediaUrl(dbConfig.logoMobile),
        logoFooter: getMediaUrl(dbConfig.logoFooter),
      },
      backgrounds: {
        mainImage: dbConfig.backgroundMainImage ? getMediaUrl(dbConfig.backgroundMainImage) : null,
        menuImage: dbConfig.backgroundMenuImage ? getMediaUrl(dbConfig.backgroundMenuImage) : null,
      },
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
 * Helper: Get effective background value based on type
 */
export function getBackgroundValue(config: AppConfig, target: 'main' | 'menu'): string {
  const bg = config.theme.backgrounds[target]

  if (bg.type === 'image') {
    // If type is image, use the uploaded image from PayloadCMS
    const imageUrl =
      target === 'main'
        ? config.dynamic.backgrounds.mainImage
        : config.dynamic.backgrounds.menuImage

    if (!imageUrl) {
      throw new Error(
        `Background type is set to "image" but no image uploaded in PayloadCMS for ${target} background`,
      )
    }
    return imageUrl
  }

  // If type is color, use the color value from env
  return bg.value
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
