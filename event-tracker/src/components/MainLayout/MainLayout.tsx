import React from 'react'
import Footer from '../Footer/Footer'

import styles from './main-layout.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { URLS } from '../../constants'

interface MainLayoutProps {
  children: React.ReactNode
  activeTab?: 'events' | 'artists'
  onTabChange?: (tab: 'events' | 'artists') => void
  currentDate?: string
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  // activeTab = 'events',
  // onTabChange,
  // currentDate,
}) => {
  return (
    <div className={styles['main-layout']}>
      <div className={styles['layout-content']}>
        <div className={styles['logo-container']}>
          <Link href={URLS.HOME}>
            <Image src="/media/logotype-desktop.png" alt="Logo" width={650} height={100} />
          </Link>
        </div>
        <main className={styles['main-content']}>
          {children}
          <Footer />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
