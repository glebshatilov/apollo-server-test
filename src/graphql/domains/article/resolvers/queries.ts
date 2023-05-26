import Neo4jArticleService from '../../../../neo4j/services/article.service.js'
import { mapUser } from '../../../utils/mappers.js'

export default {
  Query: {
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
