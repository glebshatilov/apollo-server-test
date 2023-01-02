import { ApolloServer } from '@apollo/server'

import schema from './schema.js'
import { getDynamicContext } from './context.js'

const apolloServer = new ApolloServer({
  schema
})

export {
  getDynamicContext,
  schema,
  apolloServer
}
