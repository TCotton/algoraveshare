/* eslint-env node */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const configPath = path.resolve(__dirname, '../src/configs/drizzle.config.ts')
console.log('Reading config file', configPath)
try {
  // Use dynamic import via ts-node/register is not available here; we attempt to parse as text
  const text = fs.readFileSync(configPath, 'utf8')

  // Try to extract schema path - support both string literals and path.resolve patterns
  let schemaRel

  // Pattern 1: schema: "path/to/schema.ts"
  let m = text.match(/schema:\s*["']([^"']+)["']/)
  if (m) {
    schemaRel = m[1]
  } else {
    // Pattern 2: schema: path.resolve(__dirname, 'schema.ts')
    m = text.match(/schema:\s*path\.resolve\(__dirname,\s*["']([^"']+)["']\)/)
    if (m) {
      schemaRel = m[1]
    }
  }

  if (!schemaRel) {
    console.error('Could not find schema entry in config')
    console.error('Expected pattern: schema: "path" or schema: path.resolve(__dirname, "path")')
    process.exit(2)
  }

  const schemaPath = path.resolve(path.dirname(configPath), schemaRel)
  console.log('Resolved schema path:', schemaPath)
  if (!fs.existsSync(schemaPath)) {
    console.error('Schema file NOT found at', schemaPath)
    process.exit(3)
  }
  console.log('Schema file exists. Good.')
  process.exit(0)
} catch (err) {
  console.error('Error reading config or schema:', err)
  process.exit(1)
}
