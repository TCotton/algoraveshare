import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

const db = drizzle(pool)

async function main() {
  console.log('Migrating database...')
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const migrationsFolder = path.resolve(__dirname, '../migrations')
  const journalPath = path.resolve(migrationsFolder, 'meta', '_journal.json')
  console.log('Using migrations folder:', migrationsFolder)
  console.log('Expected journal path:', journalPath)
  await migrate(db, { migrationsFolder })
  console.log('Migration complete!')
  process.exit(0)
}

main().catch((error) => {
  console.error('Error during migration:', error)
  process.exit(1)
})
