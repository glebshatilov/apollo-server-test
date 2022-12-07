import ArticleService from '../../../../neo4j/services/article.service.js'

export default {
  Mutation: {
    article: async () => ({
      create: async ({ title, text, authorId }, { neo4jDriver }) => {
        const articleService = new ArticleService(neo4jDriver)

        const article = await articleService.add(title, text, authorId)

        return article
      }
    })
  }
}
