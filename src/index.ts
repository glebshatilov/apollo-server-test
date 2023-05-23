import express, { Express, Request, Response, NextFunction } from 'express'
import http, { Server } from 'http'
import cors from 'cors'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import { expressMiddleware } from '@apollo/server/express4'
import { createHandler } from 'graphql-sse/lib/use/express'
import { apolloServer, schema, getDynamicContext } from './graphql/index.js'
import { LOGGING_REQUESTS } from './utils/variables.js'

const app: Express = express()
const httpServer: Server = http.createServer(app)

await apolloServer.start()

if (['common'].includes(LOGGING_REQUESTS)) {
  app.use(morgan('dev'))
}

// GraphQL SSE for Subscriptions
app.use(
  '/graphql/stream',
  cors(),
  createHandler({
    schema,
    context: async (req) => getDynamicContext(req)
  })
)

// Apollo Server middleware
app.use(
  '/',
  cors(),
  bodyParser.json(),
  expressMiddleware(apolloServer, {
    context: async ({ req }) => getDynamicContext(req)
  })
)

httpServer.listen(4000, () => {
  console.log(`🚀 Server ready at http://localhost:4000/`)
})
