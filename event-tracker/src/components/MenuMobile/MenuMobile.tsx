'use client'
import Navigation from '../Icons/Navigation'
import styles from './menu-mobile.module.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const MenuMobile = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const activeTab = pathname.split('/')[1] || 'events'

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden'

      // Handle escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false)
      }
      document.addEventListener('keydown', handleEscape)

      return () => {
        document.body.style.overflow = 'unset'
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isOpen])

  return (
    <>
      <div className={styles.menuMobile}>
        <button
          className={styles.menuMobileIcon}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          <Navigation />
        </button>
      </div>
      {isOpen && (
        <div
          className={styles.menuMobileContent}
          onClick={(e) => {
            // Close menu only if clicking on the overlay itself, not the navigation items
            if (e.target === e.currentTarget) {
              setIsOpen(false)
            }
          }}
        >
          <Link href="/" onClick={() => setIsOpen(false)}>
            <span
              className={`${styles.menuMobileContentItemText} ${activeTab === 'events' ? styles.menuMobileContentItemTextActive : ''}`}
            >
              Události
            </span>
          </Link>
          <Link href="/artists" onClick={() => setIsOpen(false)}>
            <span
              className={`${styles.menuMobileContentItemText} ${activeTab === 'artists' ? styles.menuMobileContentItemTextActive : ''}`}
            >
              Umělci
            </span>
          </Link>
        </div>
      )}
    </>
  )
}

export default MenuMobile
