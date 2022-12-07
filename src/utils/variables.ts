import { config } from 'dotenv'

// Load config from .env
config()

export const NEO4J_URI = process.env.NEO4J_URI
export const NEO4J_USERNAME = process.env.NEO4J_USERNAME
export const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD
