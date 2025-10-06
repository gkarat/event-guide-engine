'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import styles from './tabs-switch.module.css'
import { useRouter } from 'next/navigation'

const TabsSwitchClient = () => {
  const pathname = usePathname()
  const router = useRouter()
  const activeTab = pathname.split('/')[1] || 'events'

  return (
    <div className={styles.tabsSwitch}>
      <button
        className={`${styles.tabsSwitchButton} ${activeTab === 'events' ? styles.tabsSwitchButtonActive : ''} ${styles.firstTab}`}
        onClick={() => router.push('/')}
      >
        <span className={styles.tabsSwitchButtonText}>Události</span>
      </button>
      <button
        className={`${styles.tabsSwitchButton} ${activeTab === 'artists' ? styles.tabsSwitchButtonActive : ''} ${styles.lastTab}`}
        onClick={() => router.push('/artists')}
      >
        <span className={styles.tabsSwitchButtonText}>Umělci</span>
      </button>
    </div>
  )
}

export default TabsSwitchClient
