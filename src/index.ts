import { startStandaloneServer } from '@apollo/server/standalone'
import apolloServer from './graphql/index.js'
import { initDriver } from './neo4j/index.js'
import { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD} from './utils/variables.js'


const neo4jDriver = await initDriver(NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD)

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(apolloServer, {
  listen: { port: 4000 },
  context: async ({ req}) => {
    return {
      token: req.headers.token,
      neo4jDriver
    }
  }
})
/**/
console.log(`🚀  Server ready at: ${url}`)
