import React from 'react'
import Link from 'next/link'
import styles from './event-not-found.module.css'

const EventNotFound: React.FC = () => {
  return (
    <div className={styles.eventNotFound}>
      <h1 className={styles.eventNotFoundTitle}>Událost nenalezena</h1>
      <p className={styles.eventNotFoundDescription}>
        Událost, kterou hledáte, neexistuje nebo byla odstraněna.
      </p>
      <Link href="/" className="link">
        Zpět na hlavní stránku
      </Link>
    </div>
  )
}

export default EventNotFound
