import React from 'react'
import { notFound } from 'next/navigation'
import ArtistDetail from '@/components/ArtistDetail/ArtistDetail'
import { getArtist } from '@/api'

interface ArtistPageProps {
  params: Promise<{
    id: string
  }>
}

const ArtistPage: React.FC<ArtistPageProps> = async ({ params }) => {
  const { id } = await params
  const artist = await getArtist(id)

  if (!artist) {
    notFound()
  }

  return <ArtistDetail artist={artist} />
}

export default ArtistPage
