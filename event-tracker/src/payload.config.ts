// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Venues } from './collections/Venues'
import { Events } from './collections/Events'
import { en } from '@payloadcms/translations/languages/en'
import { Artists } from './collections/Artists'

// Add more interface languages here
// import { de } from '@payloadcms/translations/languages/de' // German

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Venues, Events, Artists],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [payloadCloudPlugin()],
  i18n: {
    fallbackLanguage: 'en',
    supportedLanguages: {
      en,
      // Add more interface languages here
      // de
    },
  },
  localization: {
    locales: process.env.CONTENT_LOCALES?.split(',') || ['en-US'],
    defaultLocale: 'en-US',
  },
})
