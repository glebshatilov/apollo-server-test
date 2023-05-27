import Neo4jArticleService from '../../../../neo4j/services/article.service.js'
import { mapUser } from '../../../utils/mappers.js'
import { ArticleIncorrectIdError } from '../../../errors/article.errors.js'

export default {
  Query: {
    article: async (parent, { id }, { neo4jDriver, authUser }) => {
      const neo4jArticleService = new Neo4jArticleService(neo4jDriver)

      const article = await neo4jArticleService.getArticleById(id)

      if (!article) throw new ArticleIncorrectIdError()

      if (article.author) article.author = mapUser(article.author)

      return article
    },
    articles: async(parent, { pagination }, { neo4jDriver }) => {
      const neo4jArticleService = new Neo4jArticleService(neo4jDriver)

      const articles = await neo4jArticleService.getAll(pagination)

      // mapping for authors
      articles.forEach(article => article.author = mapUser(article.author))

      return { // ToDo: add pagination
        data: articles
      }
    }
  }
}
