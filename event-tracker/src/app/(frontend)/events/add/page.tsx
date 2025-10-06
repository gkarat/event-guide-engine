import React from 'react'
import AddEventForm from '@/components/AddEventForm'

export const metadata = {
  title: 'Přidat událost - Event Tracker',
  description: 'Přidejte novou událost do našeho systému',
}

export default function AddEventPage() {
  return (
    <div>
      <AddEventForm />
    </div>
  )
}
