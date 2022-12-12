import { ApolloServer } from '@apollo/server'
import schema from './schema.js'

export { default as context } from './context.js'

export const apolloServer = new ApolloServer({
  schema
})
