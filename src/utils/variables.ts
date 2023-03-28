import { config } from 'dotenv'

// Load config from .env
config()

export const NEO4J_URI = process.env.NEO4J_URI
export const NEO4J_USERNAME = process.env.NEO4J_USERNAME
export const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD
export const JWT_SECRET = process.env.JWT_SECRET
export const JWT_EXPIRE_TIME = process.env.JWT_EXPIRE_TIME
export const SALT_ROUNDS = process.env.SALT_ROUNDS
export const LOGGING_REQUESTS = process.env.LOGGING_REQUESTS
