import type { NextConfig } from 'next'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

// Only load .env file if it exists (for local development)
// During Docker build, environment variables are provided via Docker/container runtime
const envPath = path.join(__dirname, '../.env')
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
}

if (process.env.DOCKER_BUILD === 'true') {
  // Helpful debug during image build without leaking secrets
  console.log('[next.config] Docker build mode detected')
}

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

export default nextConfig
