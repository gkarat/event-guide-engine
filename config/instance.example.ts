/**
 * Event Guide Instance Configuration
 *
 * This is the main configuration file for your Event Guide instance.
 * Customize these values to match your needs.
 */

export const config = {
  /**
   * Site Information
   * Basic details about your event guide instance
   */
  site: {
    /** Display name of your event guide (used in titles, meta tags, etc.) */
    name: 'Event Guide',

    /** Full URL where your site will be hosted (used for SEO, social sharing) */
    url: 'https://localhost:3000',

    /** IANA timezone for displaying event times (e.g., 'America/New_York', 'Europe/London', 'Asia/Tokyo') */
    timezone: 'UTC',
  },

  /**
   * Visual Theme Configuration
   * These values control the appearance of your event guide
   */
  theme: {
    /**
     * Primary brand color (hex format: #RRGGBB)
     * Used for interactive elements, accents, and highlights
     * All other color tokens in design.css derive from this
     */
    brandColor: '#FF0000',

    /**
     * Primary text color (hex format: #RRGGBB)
     * Main color for body text and content
     */
    textPrimary: '#1A1A1A',

    /**
     * Secondary text color (hex format: #RRGGBB)
     * Used for less prominent text, labels, and metadata
     */
    textSecondary: '#666666',

    /**
     * Font Family (optional)
     * If not set, will use system default sans-serif
     * Examples: 'Inter', 'Roboto', 'Open Sans'
     */
    fontFamily: undefined,

    /**
     * Font URL (optional, only if fontFamily is set)
     * URL to preload custom font from (typically Google Fonts or similar)
     * Example: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
     */
    fontUrl: undefined,

    /**
     * Main Background Configuration
     * Controls the primary page background
     */
    mainBgType: 'color' as 'color' | 'image',

    /** Background color (used when mainBgType is 'color') */
    mainBgColor: '#141414',

    /**
     * Background image filename (used when mainBgType is 'image')
     * Place the file in /public/media/ directory
     * Supported formats: .jpg, .png, .webp, .svg
     */
    mainBgImage: 'background-main.jpg',

    /**
     * Menu Background Configuration
     * Controls the navigation/menu background
     */
    menuBgType: 'color' as 'color' | 'image',

    /** Background color (used when menuBgType is 'color') */
    menuBgColor: '#1a1a1a',

    /**
     * Background image filename (used when menuBgType is 'image')
     * Place the file in /public/media/ directory
     */
    menuBgImage: 'background-menu.jpg',
  },

  /**
   * Branding Assets
   * Logo filenames (all files should be placed in /public/media/ directory)
   * Supported formats: .svg (recommended), .png, .jpg, .webp
   */
  branding: {
    /** Desktop logo (recommended size: 650x100px) */
    logoDesktop: 'logo-desktop.svg',

    /** Mobile logo (recommended size: 250x50px) */
    logoMobile: 'logo-mobile.svg',

    /** Footer logo (recommended: SVG, square or circular) */
    logoFooter: 'logo-footer.svg',
  },

  /**
   * Internationalization (i18n)
   * Configure supported languages for your content
   */
  i18n: {
    /**
     * List of supported locale codes
     * Examples: ['en'], ['en', 'de', 'es'], ['fr', 'nl']
     */
    locales: ['en'],

    /**
     * Default locale (must be one of the locales above)
     * This is used as fallback and for users without language preference
     */
    defaultLocale: 'en',
  },
} as const

/**
 * Type export for internal use
 * Do not modify this
 */
export type InstanceConfig = typeof config
