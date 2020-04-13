import dotenv from 'dotenv'
dotenv.config()

export const GAME_UPDATED = 'GAME_CREATED'

// Move this into a configuration file
export const DATABASE_NAME = 'test-database'

export const IS_DEBUG = process.env.NODE_END === 'development'
