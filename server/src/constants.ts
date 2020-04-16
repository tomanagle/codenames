import dotenv from 'dotenv'
dotenv.config()

export const GAME_UPDATED = 'GAME_CREATED'

// Move this into a configuration file
export const DATABASE_NAME = 'test-database'

const ENV = process.env.NODE_ENV || 'development'

export const IS_DEBUG = ENV === 'development'

export const MONO_DB_CONNECTION_STRING =
    process.env.MONO_DB_CONNECTION_STRING || 'mongodb://localhost/test-database'
export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000'
