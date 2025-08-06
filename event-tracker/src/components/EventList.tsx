import payload from '@/api'

const EventList = async () => {
  const events = await payload.find({
    collection: 'events',
  })
  console.log(events)
  return <div>{events.docs.map((event) => JSON.stringify(event))}</div>
}

export default EventList
