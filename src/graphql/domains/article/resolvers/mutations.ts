import Neo4jArticleService from '../../../../neo4j/services/article.service.js'
import { UnauthorizedError } from '../../../errors/auth.error.js'

export default {
  Mutation: {
    article: async () => ({
      create: async ({ title, text }, { neo4jDriver, authUser }) => {
        if (!authUser?.id) throw new UnauthorizedError()

        const neo4jArticleService = new Neo4jArticleService(neo4jDriver)

        const article = await neo4jArticleService.add(title, text, authUser.id)

        return article
      }
    })
  }
}
