'use client'

import React from 'react'
import styles from './footer.module.css'
import Image from 'next/image'
import { URLS } from '../../constants.client'
import Link from 'next/link'
import FooterBadge from '../Icons/BadgeLogo'

const Footer: React.FC = () => {
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
        <Link
          href={URLS.ADD_EVENT}
          className={`link ${styles['text-footer']}`}
          onNavigate={() => window.scrollTo({ top: 0, behavior: 'instant' })}
        >
          Přidat událost
        </Link>
        <Link
          href={URLS.FEEDBACK}
          className={`link ${styles['text-footer']}`}
          onNavigate={() => window.scrollTo({ top: 0, behavior: 'instant' })}
        >
          Poslat zpětnou vazbu
        </Link>
      </div>
      <Link href={URLS.WEBSITE || '/'} className={styles['footer-contact']}>
        <div className={styles['footer-badge-container']}>
          <FooterBadge />
        </div>
        <span className={`link ${styles['footer-link']}`}>
          {URLS.WEBSITE && URLS.WEBSITE.split('https://')[1]}
        </span>
      </Link>
    </footer>
  )
}

export default Footer
