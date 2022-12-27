import ArticleService from '../../../../neo4j/services/article.service.js'
import Neo4jUserService from '../../../../neo4j/services/user.service.js'

export default {
  User: {
    articles: async (parent, args, { neo4jDriver }) => {
      const articleService = new ArticleService(neo4jDriver)

      const authorId = parent.id
      const articles = await articleService.getAllByAuthor(authorId)

      return articles
    },
    following: async (parent, args, { neo4jDriver }) => {
      const neo4jUserService = new Neo4jUserService(neo4jDriver)

      const userId = parent.id
      const users = await neo4jUserService.getFollowingList(userId)

      return users
    },
    followers: async (parent, args, { neo4jDriver }) => {
      const neo4jUserService = new Neo4jUserService(neo4jDriver)

      const userId = parent.id
      const users = await neo4jUserService.getFollowersList(userId)

      return users
    },
  }
}
