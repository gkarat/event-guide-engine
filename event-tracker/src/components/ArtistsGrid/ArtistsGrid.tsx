import { getArtists } from '@/api'
import { Artist } from '@/payload-types'
import styles from './artists-grid.module.css'
import Image from 'next/image'
import Link from 'next/link'

const getAvatar = (artist: Artist) => {
  if (artist.avatar.type === 'url') {
    return artist.avatar.url
  }
  if (artist.avatar.type === 'media') {
    return artist.avatar.media?.url
  }

  return null
}

const ArtistsGrid: React.FC = async () => {
  const artists = await getArtists()

  if (!artists) {
    return <div>No artists found</div>
  }

  return (
    <div className={styles.artistsGrid}>
      {artists.docs.map((artist) => {
        const artistData = artist as Artist

        const avatarUrl = getAvatar(artistData)

        return (
          <Link
            href={`/artists/${artistData.id}`}
            key={artistData.id}
            className={styles.artistCard}
          >
            <div className={styles.artistAvatarContainer}>
              <Image src={avatarUrl} alt={artistData.name} fill className={styles.artistAvatar} />
              <div className={styles.artistAvatarOverlay} />
            </div>
            <div className={styles.artistName}>{artistData.name}</div>
          </Link>
        )
      })}
    </div>
  )
}

export default ArtistsGrid
