import React from 'react'
import TabsSwitchClient from '../TabsSwitch/TabsSwitchClient'
import styles from './top-panel.module.css'
import type { DynamicConfig } from '@/config'

interface TopPanelProps {
  dynamicConfig: DynamicConfig
}

const TopPanel: React.FC<TopPanelProps> = ({ dynamicConfig }) => {
  return (
    <div className={styles.topPanel}>
      <TabsSwitchClient dynamicConfig={dynamicConfig} />
      {/*  <SearchField /> */}
    </div>
  )
}

export default TopPanel
