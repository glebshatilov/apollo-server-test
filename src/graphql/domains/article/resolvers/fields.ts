import Neo4jArticleService from '../../../../neo4j/services/article.service.js'

export default {
  Article: {
    author: async (parent, args, { neo4jDriver }) => {
      const neo4jArticleService = new Neo4jArticleService(neo4jDriver)

      const articleId = parent.id

      const author = await neo4jArticleService.getAuthor(articleId)

      return author
    }
  }
}
