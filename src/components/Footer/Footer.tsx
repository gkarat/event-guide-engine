import React from 'react'
import styles from './footer.module.css'
import Image from 'next/image'
import { URLS } from '@/constants'
import Link from 'next/link'
import type { DynamicConfig } from '@/config'
import { loadStaticConfig } from '@/config'

interface FooterProps {
  dynamicConfig: DynamicConfig
}

const Footer: React.FC<FooterProps> = ({ dynamicConfig }) => {
  const staticConfig = loadStaticConfig()

  // Extract footer logo URL from static config (construct full path)
  const footerLogo = `/media/${staticConfig.branding.logoFooter}`

  // Get UI text from dynamic config
  const addEventText = dynamicConfig.ui.footer.addEventText
  const feedbackText = dynamicConfig.ui.footer.sendFeedbackText

  return (
    <footer className={styles['footer']}>
      <div className={styles['footer-decoration']}>
        <Image
          src="/media/footer-art.png"
          alt="Footer decoration"
          className={styles['footer-art']}
          width={500}
          height={100}
        />
      </div>
      {/* Links */}
      <div className={styles['footer-links']}>
        <Link href={URLS.ADD_EVENT} className={`link ${styles['text-footer']}`}>
          {addEventText}
        </Link>
        <Link href={URLS.FEEDBACK} className={`link ${styles['text-footer']}`}>
          {feedbackText}
        </Link>
      </div>
      <Link href={staticConfig.site.url || '/'} className={styles['footer-contact']}>
        <div className={styles['footer-badge-container']}>
          {footerLogo && <Image src={footerLogo} alt={`${staticConfig.site.name} logo`} fill />}
        </div>
        <span className={`link ${styles['footer-link']}`}>
          {staticConfig.site.url.replace(/https?:\/\//, '')}
        </span>
      </Link>
    </footer>
  )
}

export default Footer
