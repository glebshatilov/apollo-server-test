import ArticleService from '../../../../neo4j/services/article.service.js'

export default {
  User: {
    articles: async (parent, args, { neo4jDriver }) => {
      const articleService = new ArticleService(neo4jDriver)

      const authorId = parent.id
      const articles = await articleService.getAllByAuthor(authorId)

      return articles
    }
  }
}
