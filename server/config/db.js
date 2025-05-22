import dotenv from 'dotenv'
import path from 'path'

// Load .env from one directory up
dotenv.config({ path: path.resolve(process.cwd(), '../.env') })

import knex from 'knex'
import { Model } from 'objection'

console.log('Connecting to DB at:', process.env.DATABASE_URL)

const config = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations'
  }
}

const db = knex(config)
Model.knex(db)

export { db }

export const connectDB = async () => {
  try {
    await db.raw('SELECT 1')
    console.log('✅ PostgreSQL connected successfully')
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error)
    throw error
  }
}
