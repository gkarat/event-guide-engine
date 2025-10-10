'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface HeaderProps {
  activeTab?: 'events' | 'artists'
  onTabChange?: (tab: 'events' | 'artists') => void
}

const Header: React.FC<HeaderProps> = ({ activeTab = 'events', onTabChange }) => {
  return (
    <header className="header">
      <div className="header-content">
        {/* Logo */}
        <div className="logo">
          <Link href="/">
            <Image
              src="/media/logotype-desktop.png"
              alt="aggreg8brno"
              className="logo-image"
              fill
            />
          </Link>
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
      </div>
    </header>
  )
}

export default Header
