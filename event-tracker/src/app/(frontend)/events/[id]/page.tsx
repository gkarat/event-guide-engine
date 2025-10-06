import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'
import EventDetail from '@/components/EventDetail/EventDetail'
import { getEvent } from '@/api'
import LoadingIndicator from '@/components/LoadingIndicator/LoadingIndicator'

interface EventPageProps {
  params: Promise<{
    id: string
  }>
}

const EventPage: React.FC<EventPageProps> = async ({ params }) => {
  const { id } = await params
  const event = await getEvent(id)

  if (!event) {
    notFound()
  }

  return (
    <Suspense fallback={<LoadingIndicator />}>
      <EventDetail event={event} />
    </Suspense>
  )
}

export default EventPage

// Generate static params for the events that exist
export async function generateStaticParams() {
  // For now, return empty array to make all routes dynamic
  // In the future, you could fetch all event IDs and return them here for static generation
  return []
}
