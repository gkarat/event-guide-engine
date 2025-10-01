import React from 'react'
import MainLayout from '../../components/MainLayout/MainLayout'
import EventList from '../../components/EventList'
import './styles.css'

export default async function HomePage() {
  // Get current date in Czech format
  // TODO: make currentdate variable
  const currentDate = new Date().toLocaleDateString('cs-CZ', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  return (
    <MainLayout activeTab="events" currentDate={currentDate}>
      <EventList />
    </MainLayout>
  )
}
