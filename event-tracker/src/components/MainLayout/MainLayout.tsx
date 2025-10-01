import Image from 'next/image'
import React from 'react'
import Footer from '../Footer/Footer'
import Header from '../Header'

import styles from './main-layout.module.css'

interface MainLayoutProps {
  children: React.ReactNode
  activeTab?: 'events' | 'artists'
  onTabChange?: (tab: 'events' | 'artists') => void
  currentDate?: string
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  activeTab = 'events',
  onTabChange,
  currentDate,
}) => {
  return (
    <div className={styles['main-layout']}>
      <div className={styles['layout-content']}>
        <div className={styles['logo-container']}>
          <img src="/media/logotype-desktop.png" alt="Logo" />
        </div>
        <main className={styles['main-content']}>
          <div>Test</div>
          <Footer />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
