import { withPayload } from '@payloadcms/next/withPayload'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

// Load .env file from parent directory (root of the project)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envPath = path.join(__dirname, '../.env')

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
  console.log('[next.config.mjs] Loaded .env from parent directory')
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
