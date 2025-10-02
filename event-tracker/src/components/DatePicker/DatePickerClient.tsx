'use client'
import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './date-picker.module.css'
import { format } from 'date-fns'
import DatePickerToggle from '../Icons/DatePickerToggle'

const DatePickerClient = ({
  currentDate,
  selectedDate,
}: {
  currentDate: string
  selectedDate: string
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

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

  return (
    <div className={styles['date-picker']}>
      <input
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        className={styles.dateInput}
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
          <DatePickerToggle />
        </div>
      </div>
    </div>
  )
}

export default DatePickerClient
