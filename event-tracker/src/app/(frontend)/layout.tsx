import React from 'react'
import '../global.css'
import Link from 'next/link'
import { URLS } from '@/constants'
import Footer from '@/components/Footer/Footer'
import styles from './layout.module.css'
import Image from 'next/image'
import TopPanel from '@/components/TopPanel/TopPanel'
import MenuMobile from '@/components/MenuMobile/MenuMobile'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  // TODO: make lang variable
  return (
    <html lang="en">
      <body>
        <div>
          <div className={styles['main-layout']}>
            <div className={styles['layout-content']}>
              <div className={styles['header-container']}>
                <div className={styles['logo-container']}>
                  <Link href={URLS.HOME}>
                    <Image src="/media/logotype-desktop.png" alt="Logo" width={650} height={100} />
                  </Link>
                </div>
                <MenuMobile />
              </div>
              <TopPanel />
              <main className={styles['main-content']}>
                {children}
                <Footer />
              </main>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
