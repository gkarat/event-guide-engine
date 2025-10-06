import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Artist } from '@/payload-types'
import styles from './artist-detail.module.css'

interface ArtistDetailProps {
  artist: Artist
}

const ArtistDetail: React.FC<ArtistDetailProps> = ({ artist }) => {
  const getAvatarUrl = (): string | null => {
    if (artist.avatar?.type === 'url' && artist.avatar.url) {
      return artist.avatar.url
    }
    if (
      artist.avatar?.type === 'media' &&
      artist.avatar.media &&
      typeof artist.avatar.media === 'object' &&
      artist.avatar.media.url
    ) {
      return artist.avatar.media.url
    }
    return null
  }

  return (
    <div className={styles.artistDetail}>
      {getAvatarUrl() && (
        <div className={styles.artistDetailImage}>
          <Image src={getAvatarUrl()!} alt={artist.name} fill priority />
        </div>
      )}

      <div className={styles.artistDetailContent}>
        <div className={styles.artistDetailInfo}>
          <h1 className={styles.artistDetailTitle}>{artist.name}</h1>
          {artist.location && <p className={styles.artistDetailLocation}>{artist.location}</p>}
        </div>
        {artist.description && (
          <div className={styles.artistDetailDescription}>
            <p>{artist.description}</p>
          </div>
        )}
        {artist.url && (
          <Link
            href={artist.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.artistDetailUrl} link`}
          >
            {artist.url}
          </Link>
        )}
        {artist.tags && artist.tags.length > 0 && (
          <div className={styles.artistDetailTags}>
            <div className={styles.tagsList}>
              {artist.tags.map((tagItem, index) => (
                <span key={index}>#{tagItem.tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ArtistDetail
