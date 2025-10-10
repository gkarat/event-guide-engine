import React from 'react'
import '../global.css'
import Link from 'next/link'
import { URLS } from '@/constants'
import Footer from '@/components/Footer/Footer'
import styles from './layout.module.css'
import Image from 'next/image'
import TopPanel from '@/components/TopPanel/TopPanel'
import MenuMobile from '@/components/MenuMobile/MenuMobile'
import { loadStaticConfig, loadDynamicConfig } from '@/config'
import { generateThemeStyles, getFontPreloadLink, validateConfig } from '@/config/themeGenerator'

/**
 * Generate metadata from static configuration
 */
export async function generateMetadata() {
  const config = loadStaticConfig()

  return {
    title: config.site.name,
    description: `Events and artists at ${config.site.name}`,
  }
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  // Load configurations
  const staticConfig = loadStaticConfig()
  const dynamicConfig = await loadDynamicConfig()

  // Validate configuration in development
  validateConfig(staticConfig)

  // Generate theme styles and font link
  const themeStyles = generateThemeStyles(staticConfig)
  const fontUrl = getFontPreloadLink(staticConfig)

  // Extract logo URL from dynamic config
  const logoDesktop = dynamicConfig.branding.logoDesktop

  return (
    <html lang={staticConfig.i18n.defaultLocale}>
      <head>
        {/* Preload custom font if provided */}
        {fontUrl && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="stylesheet" href={fontUrl} />
          </>
        )}
      </head>
      <body style={themeStyles}>
        <div>
          <div className={styles['main-layout']}>
            <div className={styles['layout-content']}>
              <div className={styles['header-container']}>
                <div className={styles['logo-container']}>
                  <Link href={URLS.HOME}>
                    {logoDesktop && (
                      <Image
                        src={logoDesktop}
                        alt={staticConfig.site.name}
                        width={650}
                        height={100}
                      />
                    )}
                  </Link>
                </div>
                <MenuMobile dynamicConfig={dynamicConfig} />
              </div>
              <TopPanel dynamicConfig={dynamicConfig} />
              <div className={styles['content']}>
                <main className={styles['main-content']}>{children}</main>
                <Footer dynamicConfig={dynamicConfig} />
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
