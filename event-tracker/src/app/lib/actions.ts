'use server'

import payloadConfig from '@/payload.config'
import { getPayload } from 'payload'
import { Media } from '@/payload-types'

export const getEvents = async (params: Record<string, unknown> = {}) => {
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

export const getVenues = async (params: Record<string, unknown> = {}) => {
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

export const getArtists = async (params: Record<string, unknown> = {}) => {
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

export const uploadMedia = async (form: FormData) => {
  const file = form.get('file')

  if (!(file instanceof File)) {
    throw new Error('Invalid file')
  }
  const payload = await getPayload({ config: payloadConfig })

  const type = form.get('type') as Media['type']
  const alt = (form.get('alt') as string) || file.name

  const buffer = Buffer.from(await file.arrayBuffer())

  const media = await payload.create({
    collection: 'media',
    data: { type, alt },
    file: { data: buffer, mimetype: file.type, name: file.name, size: file.size },
  })

  return media
}

export const createEvent = async (data: any) => {
  const payload = await getPayload({ config: payloadConfig })
  const event = await payload.create({
    collection: 'events',
    data,
  })

  return event
}
