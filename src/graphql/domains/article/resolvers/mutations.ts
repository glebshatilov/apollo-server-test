import Neo4jArticleService from '../../../../neo4j/services/article.service.js'
import { UnauthorizedError } from '../../../errors/auth.error.js'

export default {
  Mutation: {
    article: async () => ({
      create: async ({ title, content }, { neo4jDriver, authUser }) => {
        if (!authUser?.id) throw new UnauthorizedError()

        const neo4jArticleService = new Neo4jArticleService(neo4jDriver)

        const article = await neo4jArticleService.add(title, content, authUser.id)

        return {
          code: '200',
          success: true,
          article
        }
      },
      like: async ({ articleId }, { neo4jDriver, authUser }) => {
        if (!authUser?.id) throw new UnauthorizedError()

        const neo4jArticleService = new Neo4jArticleService(neo4jDriver)

        const article = await neo4jArticleService.addLike(articleId, authUser.id)

        return {
          code: '200',
          success: true,
          article
        }
      },
      removeLike: async ({ articleId }, { neo4jDriver, authUser }) => {
        if (!authUser?.id) throw new UnauthorizedError()

        const neo4jArticleService = new Neo4jArticleService(neo4jDriver)

        const article = await neo4jArticleService.removeLike(articleId, authUser.id)

        return {
          code: '200',
          success: true,
          article
        }
      },
    })
  }
}
