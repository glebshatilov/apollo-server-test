import { startStandaloneServer } from '@apollo/server/standalone'
import { apolloServer, context } from './graphql/index.js'

const { url } = await startStandaloneServer(apolloServer, {
  listen: { port: 4000 },
  context
})

console.log(`🚀  Server ready at: ${url}`)
