import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'

const payload = await getPayload({ config: payloadConfig })

export default payload
