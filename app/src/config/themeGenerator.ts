/**
 * Theme Generator
 *
 * Generates inline CSS custom properties from static configuration.
 * Uses safe inline styles instead of dangerouslySetInnerHTML.
 */

import type { StaticConfig } from './index'

/**
 * Generate inline style object with CSS custom properties
 * These override the default values in design.css
 */
export function generateThemeStyles(config: StaticConfig): React.CSSProperties {
  const { colors, typography, backgrounds } = config.theme

  const styles: Record<string, string> = {
    // Brand color overrides
    '--color-brand-primary': colors.brandPrimary,
    '--color-text-primary': colors.textPrimary,
    '--color-text-secondary': colors.textSecondary,
  }

  // Background configuration
  if (backgrounds.main.type === 'color') {
    styles['--color-background-primary'] = backgrounds.main.color
  } else {
    // Use background image
    styles['--color-background-primary'] = backgrounds.main.color // fallback color
    styles['background-image'] = `url(/media/${backgrounds.main.image})`
    styles['background-size'] = 'cover'
    styles['background-position'] = 'center'
    styles['background-attachment'] = 'fixed'
  }

  if (backgrounds.menu.type === 'color') {
    styles['--color-background-menu'] = backgrounds.menu.color
  } else {
    // Note: Menu background image would need to be handled separately in menu component
    styles['--color-background-menu'] = backgrounds.menu.color // fallback color
  }

  // Typography overrides (only if fontFamily is set)
  if (typography.fontFamily) {
    styles['--font-family-primary'] = `'${typography.fontFamily}', sans-serif`
  }

  return styles as React.CSSProperties
}

/**
 * Get font preload link for custom fonts
 * Returns null if no custom font URL is configured
 */
export function getFontPreloadLink(config: StaticConfig): string | null {
  return config.theme.typography.fontUrl || null
}

/**
 * Validate configuration and log warnings in development
 */
export function validateConfig(config: StaticConfig): void {
  if (process.env.NODE_ENV === 'development') {
    // Validate color format
    const colorRegex = /^#[0-9A-F]{6}$/i

    if (!colorRegex.test(config.theme.colors.brandPrimary)) {
      console.warn(
        `[Config Warning] NEXT_PUBLIC_BRAND_COLOR="${config.theme.colors.brandPrimary}" is not a valid hex color. Expected format: #RRGGBB`,
      )
    }

    if (!colorRegex.test(config.theme.colors.textPrimary)) {
      console.warn(
        `[Config Warning] NEXT_PUBLIC_TEXT_PRIMARY="${config.theme.colors.textPrimary}" is not a valid hex color. Expected format: #RRGGBB`,
      )
    }

    if (!colorRegex.test(config.theme.colors.textSecondary)) {
      console.warn(
        `[Config Warning] NEXT_PUBLIC_TEXT_SECONDARY="${config.theme.colors.textSecondary}" is not a valid hex color. Expected format: #RRGGBB`,
      )
    }

    // Validate timezone
    try {
      Intl.DateTimeFormat(undefined, { timeZone: config.site.timezone })
    } catch (_error) {
      console.warn(
        `[Config Warning] NEXT_PUBLIC_TIMEZONE="${config.site.timezone}" may not be a valid IANA timezone identifier`,
      )
    }

    // Validate site URL
    if (config.site.url && !config.site.url.startsWith('http')) {
      console.warn(
        `[Config Warning] NEXT_PUBLIC_WEBSITE_URL="${config.site.url}" should start with http:// or https://`,
      )
    }

    // Validate locales
    if (config.i18n.locales.length === 0) {
      console.warn(
        '[Config Warning] NEXT_PUBLIC_LOCALES is empty. At least one locale should be specified.',
      )
    }

    if (!config.i18n.locales.includes(config.i18n.defaultLocale)) {
      console.warn(
        `[Config Warning] NEXT_PUBLIC_DEFAULT_LOCALE="${config.i18n.defaultLocale}" is not in NEXT_PUBLIC_LOCALES="${config.i18n.locales.join(',')}"`,
      )
    }
  }
}
