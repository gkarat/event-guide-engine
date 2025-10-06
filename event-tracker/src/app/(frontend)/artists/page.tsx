import ArtistsGrid from '@/components/ArtistsGrid/ArtistsGrid'
import React, { Suspense } from 'react'
import LoadingIndicator from '@/components/LoadingIndicator/LoadingIndicator'

const ArtistsPage = () => {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <ArtistsGrid />
    </Suspense>
  )
}

export default ArtistsPage
