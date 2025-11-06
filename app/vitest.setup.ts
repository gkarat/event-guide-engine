// Any setup scripts you might need go here

// Load .env files from parent directory (root of the project)
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envPath = path.join(__dirname, '../.env')

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
  console.log('[vitest.setup.ts] Loaded .env from parent directory')
}
