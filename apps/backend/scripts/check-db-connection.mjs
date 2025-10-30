#!/usr/bin/env node
/* eslint-env node */
import 'dotenv/config'
import { Client } from 'pg'

const raw = process.env.DATABASE_URL || '<not set>'
const masked = raw.replace(/:(.*)@/, ':***@')
console.log('DATABASE_URL:', masked)

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('No DATABASE_URL set in environment. Create backend/.env or export it.')
    process.exit(1)
  }
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  try {
    await client.connect()
    const res = await client.query('SELECT version() AS v')
    console.log('Connected to Postgres:', res.rows[0].v)
    await client.end()
    process.exit(0)
  } catch (err) {
    console.error('Connection error:', err)
    process.exit(1)
  }
}

main()
