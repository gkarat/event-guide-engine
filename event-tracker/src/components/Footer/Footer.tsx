import React from 'react'
import styles from './footer.module.css'
import Image from 'next/image'
import { URLS } from '../../constants'

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
        <a href={URLS.ADD_EVENT} className={`link ${styles['text-footer']}`}>
          Přidat událost
        </a>
        <a href={URLS.FEEDBACK} className={`link ${styles['text-footer']}`}>
          Poslat zpětnou vazbu
        </a>
      </div>

      {/* Contact Information */}
      <div className={styles['footer-contact']}>
        <Image
          src="/media/logotype-badge.png"
          alt="aggreg8brno badge"
          className={styles['footer-badge']}
          width={100}
          height={100}
        />
        <a href={URLS.WEBSITE} className={`link ${styles['text-footer']}`}>
          {URLS.WEBSITE && URLS.WEBSITE.split('https://')[1]}
        </a>
      </div>
    </footer>
  )
}

export default Footer
