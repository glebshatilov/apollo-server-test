import { ApolloServer } from '@apollo/server'
import schema from './schema.js'

const apolloServer = new ApolloServer({
  schema
})

export default apolloServer
