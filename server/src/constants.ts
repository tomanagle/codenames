import dotenv from 'dotenv'
dotenv.config()

export const GAME_UPDATED = 'GAME_CREATED'
export const GAME_RESET = 'GAME_RESET'

// Move this into a configuration file
export const DATABASE_NAME = 'test-database'

export const ENV = process.env.NODE_ENV || 'development'

export const IS_DEBUG = ENV === 'development'

export const MONO_DB_CONNECTION_STRING =
    process.env.MONO_DB_CONNECTION_STRING || 'mongodb://localhost/test-database'
export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000'

export const SENTRY_DSN = process.env.SENTRY_DSN

export const LOG_OPTIONS = {
    key: process.env.LOG_DNA_API_KEY,
    hostname: process.env.HOSTNAME || 'playcodenames.online',
    app: process.env.APP_NAME || 'codenames-server',
    env: ENV,
    handleExceptions: true,
}

export const LOG_DNA_API_KEY = process.env.LOG_DNA_API_KEY
