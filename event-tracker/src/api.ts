'use server'

import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'

export const getEvents = async (params: any = {}) => {
  try {
    const payload = await getPayload({ config: payloadConfig })
    const events = await payload.find({
      collection: 'events',
      ...params,
    })

    return events
  } catch (error) {
    console.error('Error fetching events', error)

    return null
  }
}

export const createEvent = async (params: any = {}) => {
  try {
    const payload = await getPayload({ config: payloadConfig })
    const event = await payload.create({
      collection: 'events',
      ...params,
    })

    return event
  } catch (error) {
    console.error('Error creating event', error)

    return null
  }
}

export const getVenues = async (params: any = {}) => {
  try {
    const payload = await getPayload({ config: payloadConfig })
    const venues = await payload.find({
      collection: 'venues',
      ...params,
    })

    return venues
  } catch (error) {
    console.error('Error fetching venues', error)

    return null
  }
}

export const createVenue = async (params: any = {}) => {
  try {
    const payload = await getPayload({ config: payloadConfig })
    const venue = await payload.create({
      collection: 'venues',
      ...params,
    })

    return venue
  } catch (error) {
    console.error('Error creating venue', error)

    return null
  }
}

export const getArtists = async (params: any = {}) => {
  try {
    const payload = await getPayload({ config: payloadConfig })
    const artists = await payload.find({
      collection: 'artists',
      ...params,
    })

    return artists
  } catch (error) {
    console.error('Error fetching artists', error)

    return null
  }
}

export const createArtist = async (params: any = {}) => {
  try {
    const payload = await getPayload({ config: payloadConfig })
    const artist = await payload.create({
      collection: 'artists',
      ...params,
    })

    return artist
  } catch (error) {
    console.error('Error creating artist', error)

    return null
  }
}

export const getEvent = async (id: string) => {
  try {
    const payload = await getPayload({ config: payloadConfig })
    const event = await payload.findByID({
      collection: 'events',
      id,
      depth: 2, // Include related data (artists, venue, backgroundImage)
    })

    return event
  } catch (error) {
    console.error('Error fetching event', error)

    return null
  }
}

export const getArtist = async (id: string) => {
  try {
    const payload = await getPayload({ config: payloadConfig })
    const artist = await payload.findByID({
      collection: 'artists',
      id,
      depth: 2, // Include related data (avatar media)
    })

    return artist
  } catch (error) {
    console.error('Error fetching artist', error)

    return null
  }
}
