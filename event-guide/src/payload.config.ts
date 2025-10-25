// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import dotenv from 'dotenv'
import fs from 'fs'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Venues } from './collections/Venues'
import { Events } from './collections/Events'
import { en } from '@payloadcms/translations/languages/en'
import { Artists } from './collections/Artists'
import { SiteConfig } from './collections/SiteConfig'
import { loadStaticConfig } from './config'
import { Feedback } from './collections/Feedback'

// Add more interface languages here
// import { de } from '@payloadcms/translations/languages/de' // German

// Load .env file from parent directory (root of the project)
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const envPath = path.join(dirname, '../../.env')

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
  console.log('[payload.config.ts] Loaded .env from parent directory')
}

const config = loadStaticConfig()

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Feedback, Media, Venues, Events, Artists],
  globals: [SiteConfig],
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
    locales: config.i18n.locales,
    defaultLocale: config.i18n.defaultLocale,
  },
})
