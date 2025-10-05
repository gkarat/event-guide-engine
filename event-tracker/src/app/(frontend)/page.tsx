import React, { Suspense } from 'react'
import EventList from '../../components/EventList/EventList'
import './styles.css'
import DatePickerClient from '../../components/DatePicker/DatePickerClient'
import { format } from 'date-fns'

interface EventsPageProps {
  searchParams: Promise<{
    date?: string
  }>
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const currentDate = format(new Date(), 'yyyy-MM-dd')
  const selectedDate = (await searchParams).date || currentDate

  return (
    <div>
      <DatePickerClient currentDate={currentDate} selectedDate={selectedDate} />
      <Suspense fallback={<div>Loading...</div>}>
        <EventList selectedDate={selectedDate} />
      </Suspense>
    </div>
  )
}
