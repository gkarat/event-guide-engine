'use client'
import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './date-picker.module.css'
import { format } from 'date-fns'
import DatePickerToggle from '../Icons/DatePickerToggle'

const DatePickerClient = ({
  currentDate,
  selectedDate,
  fillColor,
}: {
  currentDate: string
  selectedDate: string
  fillColor: string
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isFocused, setIsFocused] = useState(false)

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const date = e.target.value
    const params = new URLSearchParams(searchParams.toString())
    params.set('date', date)
    router.push(`?${params.toString()}`)
  }

  const formatDisplayDate = (date: string) => {
    return format(date, 'dd.MM.yyyy')
  }

  const isToday = currentDate === selectedDate

  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      inputRef.current?.showPicker()
    }
  }

  return (
    <div className={`${styles['date-picker']} ${isFocused ? styles['date-picker-focused'] : ''}`}>
      <input
        ref={inputRef}
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        className={styles.dateInput}
        aria-label={`Select date, current: ${formatDisplayDate(selectedDate)}`}
      />
      <div className={styles['date-display']}>
        <span className={styles['date-text']}>
          {isToday ? (
            <span>
              <strong>Dnes</strong>, {formatDisplayDate(selectedDate)}
            </span>
          ) : (
            formatDisplayDate(selectedDate)
          )}
        </span>
        <div className={styles['chevron-container']}>
          <DatePickerToggle fillColor={fillColor} />
        </div>
      </div>
    </div>
  )
}

export default DatePickerClient
