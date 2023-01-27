import { initDriver } from '../neo4j/index.js'
import { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD} from '../utils/variables.js'
import AuthService from './services/auth.service.js'
import { initORM } from '../orm/index.js'
import { PubSub } from 'graphql-subscriptions'

const neo4jDriver = await initDriver(NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD)
const orm = await initORM()
const pubsub = new PubSub()

export const getDynamicContext = async (req) => {
  const authService = new AuthService()

  return {
    authUser: authService.getUserDataByReq(req),
    neo4jDriver,
    em: orm.em.fork(),
    pubsub
  }
}
