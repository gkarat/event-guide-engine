'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import styles from './tabs-switch.module.css'
import { useRouter } from 'next/navigation'
import type { DynamicConfig } from '@/config'

interface TabsSwitchClientProps {
  dynamicConfig: DynamicConfig
}

const TabsSwitchClient: React.FC<TabsSwitchClientProps> = ({ dynamicConfig }) => {
  const pathname = usePathname()
  const router = useRouter()
  const activeTab = pathname.split('/')[1] || 'events'

  // Get labels from dynamic config
  const eventsLabel = dynamicConfig.ui.menu.eventsLabel
  const artistsLabel = dynamicConfig.ui.menu.artistsLabel

  return (
    <div className={styles.tabsSwitch}>
      <button
        className={`${styles.tabsSwitchButton} ${activeTab === 'events' ? styles.tabsSwitchButtonActive : ''} ${styles.firstTab}`}
        onClick={() => router.push('/')}
      >
        <span className={styles.tabsSwitchButtonText}>{eventsLabel}</span>
      </button>
      <button
        className={`${styles.tabsSwitchButton} ${activeTab === 'artists' ? styles.tabsSwitchButtonActive : ''} ${styles.lastTab}`}
        onClick={() => router.push('/artists')}
      >
        <span className={styles.tabsSwitchButtonText}>{artistsLabel}</span>
      </button>
    </div>
  )
}

export default TabsSwitchClient
