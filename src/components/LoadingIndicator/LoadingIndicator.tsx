import React from 'react'
import styles from './loading-indicator.module.css'

export type LoadingIndicatorSize = 'small' | 'medium' | 'large'

export interface LoadingIndicatorProps {
  /**
   * Size of the loading indicator
   * @default 'medium'
   */
  size?: LoadingIndicatorSize
  /**
   * Custom message for screen readers
   * @default 'Loading'
   */
  message?: string
  /**
   * Show a semi-transparent backdrop overlay
   * @default false
   */
  overlay?: boolean
  /**
   * Custom class name for the container
   */
  className?: string
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 'medium',
  message = 'Loading',
  overlay = true,
  className = '',
}) => {
  const containerClasses = [styles.container, overlay && styles.overlay, className]
    .filter(Boolean)
    .join(' ')

  const indicatorClasses = [styles.pulse, styles[`size-${size}`]].join(' ')

  return (
    <div className={containerClasses} aria-busy="true" aria-live="polite" role="status">
      <div className={indicatorClasses} />
      <span className={styles.srOnly}>{message}</span>
    </div>
  )
}

export default LoadingIndicator
