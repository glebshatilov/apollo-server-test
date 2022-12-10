import { startStandaloneServer } from '@apollo/server/standalone'
import apolloServer from './graphql/index.js'
import context from './context.js'

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(apolloServer, {
  listen: { port: 4000 },
  context
})
/**/
console.log(`🚀  Server ready at: ${url}`)
