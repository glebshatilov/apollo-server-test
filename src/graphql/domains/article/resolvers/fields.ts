import ArticleService from '../../../../neo4j/services/article.service.js'

export default {
  Article: {
    author: async (parent, args, { neo4jDriver }) => {
      const articleService = new ArticleService(neo4jDriver)

      const articleId = parent.id

      const author = await articleService.getAuthor(articleId)

      return author
    }
  }
}
