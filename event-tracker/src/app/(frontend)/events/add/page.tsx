import React, { Suspense } from 'react'
import AddEventForm from '@/components/AddEventForm'
import LoadingIndicator from '@/components/LoadingIndicator'

export const metadata = {
  title: 'Přidat událost - Event Tracker',
  description: 'Přidejte novou událost do našeho systému',
}

export default function AddEventPage() {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <AddEventForm />
    </Suspense>
  )
}
