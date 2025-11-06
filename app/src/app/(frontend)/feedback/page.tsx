import React, { Suspense } from 'react'
import FeedbackForm from '@/components/FeedbackForm'
import LoadingIndicator from '@/components/LoadingIndicator'

export default function FeedbackPage() {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <FeedbackForm />
    </Suspense>
  )
}
