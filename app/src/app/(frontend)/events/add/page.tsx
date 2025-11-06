import React, { Suspense } from 'react'
import AddEventForm from '@/components/AddEventForm'
import LoadingIndicator from '@/components/LoadingIndicator'

export default function AddEventPage() {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <AddEventForm />
    </Suspense>
  )
}
