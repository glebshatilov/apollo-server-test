import Neo4jArticleService from '../../../../neo4j/services/article.service.js'

export default {
  Query: {
    articles: async(parent, { pagination }, { neo4jDriver }) => {
      const neo4jArticleService = new Neo4jArticleService(neo4jDriver)

      const articles = await neo4jArticleService.getAll(pagination)

      return { // ToDo: add pagination
        data: articles
      }
    }
  }
}
