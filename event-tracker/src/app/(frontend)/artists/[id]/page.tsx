import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'
import ArtistDetail from '@/components/ArtistDetail/ArtistDetail'
import { getArtist } from '@/app/lib/actions'
import LoadingIndicator from '@/components/LoadingIndicator/LoadingIndicator'

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

  return (
    <Suspense fallback={<LoadingIndicator />}>
      <ArtistDetail artist={artist} />
    </Suspense>
  )
}

export default ArtistPage
