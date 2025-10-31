import React from 'react'
import Image from 'next/image'
import { Event } from '@/payload-types'
import styles from './event-detail.module.css'
import Link from 'next/link'

interface EventDetailProps {
  event: Event
}

const EventDetail: React.FC<EventDetailProps> = ({ event }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('cs-CZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getLocation = () => {
    if (event.location) {
      return event.location
    }
    if (event.venue && typeof event.venue === 'object') {
      return event.venue.name
    }
    return 'Location TBA'
  }

  const getArtists = (): React.ReactNode => {
    if (!event.artist || event.artist.length === 0) {
      return 'TBA'
    }

    return (
      <div className={styles.eventDetailArtists}>
        {event.artist.map((artistItem, index) => {
          if (artistItem.type === 'relationship' && artistItem.relationship) {
            const artist = artistItem.relationship
            if (typeof artist === 'object' && artist !== null) {
              return (
                <Link key={artist.id} href={`/artists/${artist.id}`} className="link">
                  {artist.name}
                </Link>
              )
            }
          } else if (artistItem.type === 'string' && artistItem.string) {
            return <span key={index}>{artistItem.string}</span>
          }

          console.error('Error parsing artist')
          return null
        })}
      </div>
    )
  }

  const getBackgroundImageUrl = () => {
    if (
      event.backgroundImage &&
      typeof event.backgroundImage === 'object' &&
      event.backgroundImage.url
    ) {
      return event.backgroundImage.url
    }
    return null
  }

  return (
    <div className={styles.eventDetail}>
      <div className={styles.eventDetailHeader}>
        {getBackgroundImageUrl() && (
          <div className={styles.eventDetailImage}>
            <Image src={getBackgroundImageUrl()!} alt={event.title} fill />
          </div>
        )}

        <div className={styles.eventDetailInfo}>
          <h1 className={styles.eventDetailTitle}>{event.title}</h1>
          <p className={styles.eventDetailLocation}>{getLocation()}</p>
          <p className={styles.eventDetailTime}>
            {formatDate(event.startDate)}
            {event.endDate && <span> - {formatDate(event.endDate)}</span>}
          </p>
        </div>
      </div>

      <div className={styles.eventDetailContent}>
        <div className={styles.eventDetailArtists}>{getArtists()}</div>

        {event.description && (
          <div className={styles.eventDetailDescription}>
            <p>{event.description}</p>
          </div>
        )}
        {event.url && (
          <Link href={event.url} target="_blank" rel="noopener noreferrer" className="link">
            {event.url}
          </Link>
        )}
        {event.tags && event.tags.length > 0 && (
          <div className={styles.eventDetailTags}>
            <div className={styles.tagsList}>
              {event.tags.map((tagItem, index) => (
                <span key={index}>#{tagItem.tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventDetail
