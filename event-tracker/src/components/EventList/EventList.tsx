import { getEvents } from '@/api'
import EventCard from '../EventCard/EventCard'
import { Event } from '@/payload-types'
import styles from './event-list.module.css'
import { startOfDay, endOfDay } from 'date-fns'

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('cs-CZ', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

const getVenueName = (event: Event) => {
  return event.venue && typeof event.venue === 'object'
    ? event.venue.name
    : event.location || 'Místo bude upřesněno'
}

const getBackgroundImageUrl = (event: Event) => {
  return event.backgroundImage && typeof event.backgroundImage === 'object'
    ? event.backgroundImage.url
    : undefined
}

const EventList = async ({ selectedDate }: { selectedDate: string }) => {
  const dayStart = startOfDay(new Date(selectedDate))
  const dayEnd = endOfDay(new Date(selectedDate))

  const events = await getEvents({
    where: {
      // Show only approved events
      approved: { equals: true },
      // Show only events that are today
      startDate: {
        greater_than_equal: dayStart.toISOString(),
        less_than_equal: dayEnd.toISOString(),
      },
    },
    depth: 1,
    sort: 'startDate',
  })

  if (!events?.docs || events.docs.length === 0) {
    return (
      <div className={styles.eventList}>
        <p className={styles.noEvents}>Žádné události nejsou k dispozici.</p>
      </div>
    )
  }

  return (
    <ul className={styles.eventList}>
      {events.docs.map((event) => {
        const eventData = event as Event

        // Format time from startDate
        const timeString = formatTime(eventData.startDate)

        // Get venue name (either from venue relationship or location field)
        const venueName = getVenueName(eventData)

        // Get background image URL
        const backgroundImageUrl = getBackgroundImageUrl(eventData)

        return (
          <li key={eventData.id}>
            <EventCard
              key={eventData.id}
              title={eventData.title}
              venue={venueName}
              time={timeString}
              backgroundImage={backgroundImageUrl}
            />
          </li>
        )
      })}
    </ul>
  )
}

export default EventList
