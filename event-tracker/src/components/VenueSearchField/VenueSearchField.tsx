'use client'
import React, { useState, useEffect, useRef } from 'react'
import styles from './venue-search-field.module.css'
import { getVenues } from '@/app/lib/actions'
import { Venue } from '@/payload-types'

const MIN_SEARCH_LENGTH = 2
const SEARCH_RESULTS_LIMIT = 10
const SEARCH_DEBOUNCE_MS = 300

interface VenueSearchFieldProps {
  value: string
  onChange: (venue: Venue | null) => void
  placeholder?: string
  className?: string
}

const VenueSearchField: React.FC<VenueSearchFieldProps> = ({
  value,
  onChange,
  placeholder = 'Vyhledat venue',
  className = '',
}) => {
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [venues, setVenues] = useState<Venue[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch venues when search term changes
  useEffect(() => {
    const fetchVenues = async () => {
      if (searchTerm.length < MIN_SEARCH_LENGTH) {
        setVenues([])
        setShowDropdown(false)
        return
      }

      try {
        const result = await getVenues({
          where: {
            and: [{ name: { contains: searchTerm } }, { approved: { equals: true } }],
          },
          limit: SEARCH_RESULTS_LIMIT,
          sort: 'name',
        })

        if (result?.docs) {
          setVenues(result.docs)
          setShowDropdown(true)
          setHighlightedIndex(-1)
        } else {
          setVenues([])
          setShowDropdown(false)
        }
      } catch (error) {
        setError('Error fetching venues')
        setVenues([])
        setShowDropdown(false)
      }
    }

    const debounceTimer = setTimeout(fetchVenues, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchTerm(newValue)

    // Clear error when user starts typing
    if (error) {
      setError(null)
    }

    // If user is typing and we have a selected venue, clear the selection
    if (selectedVenue && newValue !== selectedVenue.name) {
      setSelectedVenue(null)
      onChange(null)
    }
  }

  // Handle venue selection
  const handleVenueSelect = (venue: Venue) => {
    setSelectedVenue(venue)
    setSearchTerm(venue.name)
    setShowDropdown(false)
    onChange(venue)
    setHighlightedIndex(-1)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || venues.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev < venues.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : venues.length - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < venues.length) {
          handleVenueSelect(venues[highlightedIndex])
        }
        break
      case 'Escape':
        setShowDropdown(false)
        setHighlightedIndex(-1)
        break
    }
  }

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Initialize search term from value prop
  useEffect(() => {
    if (value) {
      setSearchTerm(value)
    }
  }, [value])

  return (
    <div className={`${styles.venueSearchContainer} ${className}`}>
      <div className={styles.inputWrapper}>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (venues.length > 0) {
              setShowDropdown(true)
            }
          }}
          placeholder={placeholder}
          className={styles.input}
          autoComplete="off"
        />
      </div>

      {showDropdown && venues.length > 0 && (
        <div ref={dropdownRef} className={styles.dropdown}>
          {venues.map((venue, index) => (
            <div
              key={venue.id}
              className={`${styles.dropdownItem} ${
                index === highlightedIndex ? styles.highlighted : ''
              }`}
              onClick={() => handleVenueSelect(venue)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <div className={styles.venueName}>{venue.name}</div>
              <div className={styles.venueAddress}>{venue.address}</div>
            </div>
          ))}
        </div>
      )}

      {showDropdown && searchTerm.length >= MIN_SEARCH_LENGTH && venues.length === 0 && !error && (
        <div className={styles.dropdown}>
          <div className={styles.noResults}>
            Žádné venue nenalezeno pro &quot;{searchTerm}&quot;
          </div>
        </div>
      )}

      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  )
}

export default VenueSearchField
