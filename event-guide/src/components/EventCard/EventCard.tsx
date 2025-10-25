import React from 'react'
import Image from 'next/image'
import styles from './event-card.module.css'
import Link from 'next/link'

interface EventCardProps {
  id: number
  title: string
  venue: string
  time: string
  backgroundImage?: string | null | undefined
}

const EventCard: React.FC<EventCardProps> = ({ id, title, venue, time, backgroundImage }) => {
  return (
    <Link href={`/events/${id}`}>
      <div className={styles.eventCard}>
        {backgroundImage && (
          <div className={styles.eventCardBackground}>
            <Image
              src={backgroundImage}
              alt=""
              fill
              className={styles.eventCardImage}
              style={{ objectFit: 'cover' }}
            />
            <div className={styles.eventCardOverlay} />
          </div>
        )}

        <div className={styles.eventCardContent}>
          <div className={styles.eventCardInfo}>
            <h2 className={styles.eventTitle}>{title}</h2>
            <p className={styles.eventVenue}>{venue}</p>
          </div>
          <div className={styles.eventTime}>
            <p className={styles.timeText}>{time}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default EventCard
