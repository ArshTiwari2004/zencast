import knex from 'knex'
import { Model } from 'objection'

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
    console.log('PostgreSQL connected')
  } catch (error) {
    console.error('PostgreSQL connection error:', error)
    throw error
  }
}