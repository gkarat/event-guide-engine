import React, { Suspense } from 'react'
import FeedbackForm from '@/components/FeedbackForm'
import LoadingIndicator from '@/components/LoadingIndicator'

export const metadata = {
  title: 'Zpětná vazba',
  description: 'Napište nám svou zpětnou vazbu, nápady nebo problémy.',
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <FeedbackForm />
    </Suspense>
  )
}
