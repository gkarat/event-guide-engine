import TabsSwitchClient from '../TabsSwitch/TabsSwitchClient'
import styles from './top-panel.module.css'

const TopPanel = () => {
  return (
    <div className={styles.topPanel}>
      <TabsSwitchClient />
      {/*  <SearchField /> */}
    </div>
  )
}

export default TopPanel
