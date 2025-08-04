// scripts/createAdminUser.js
import { getPayload } from 'payload'
import config from '../src/payload.config'

const run = async () => {
  const payload = await getPayload({ config })
  await payload.create({
    collection: 'users',
    data: {
      email: 'admin@example.com',
      password: 'yourpassword',
      name: 'Admin',
      role: 'admin',
    },
  })
  console.log('Admin user created!')
}

await run()
