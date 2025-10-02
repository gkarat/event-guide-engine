'use client'

import Image from 'next/image'
import React from 'react'

interface HeaderProps {
  activeTab?: 'events' | 'artists'
  onTabChange?: (tab: 'events' | 'artists') => void
  currentDate?: string
}

const Header: React.FC<HeaderProps> = ({
  activeTab = 'events',
  onTabChange,
  currentDate = 'Dnes, 24.09.2025',
}) => {
  return (
    <header className="header">
      <div className="header-content">
        {/* Logo */}
        <div className="logo">
          <Image src="/media/logotype-desktop.png" alt="aggreg8brno" className="logo-image" fill />
        </div>

        {/* Navigation */}
        <nav className="navigation">
          <button
            className={`nav-tab ${activeTab === 'events' ? 'nav-tab-active' : 'nav-tab-inactive'}`}
            onClick={() => onTabChange?.('events')}
          >
            Události
          </button>
          <button
            className={`nav-tab ${activeTab === 'artists' ? 'nav-tab-active' : 'nav-tab-inactive'}`}
            onClick={() => onTabChange?.('artists')}
          >
            Umělci
          </button>
        </nav>

        {/* Date Selector */}
        <div className="date-selector">
          <span className="text-date">{currentDate}</span>
          <svg className="date-chevron" width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path
              d="M1 1.5L6 6.5L11 1.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </header>
  )
}

export default Header
