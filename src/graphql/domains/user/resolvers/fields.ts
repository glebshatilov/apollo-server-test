import Neo4jArticleService from '../../../../neo4j/services/article.service.js'
import Neo4jUserService from '../../../../neo4j/services/user.service.js'
import { mapUsers, mapUser } from '../../../utils/mappers.js'

export default {
  User: {
    articles: async (parent, args, { neo4jDriver }) => {
      const neo4jArticleService = new Neo4jArticleService(neo4jDriver)

      const authorId = parent.id
      const articles = await neo4jArticleService.getAllByAuthor(authorId)

      // mapping for authors
      articles.forEach(article => article.author = mapUser(article.author))

      return articles
    },
    following: async (parent, args, { neo4jDriver }) => {
      const neo4jUserService = new Neo4jUserService(neo4jDriver)

      const userId = parent.id
      const users = await neo4jUserService.getFollowingList(userId)

      return mapUsers(users)
    },
    followers: async (parent, args, { neo4jDriver }) => {
      const neo4jUserService = new Neo4jUserService(neo4jDriver)

      const userId = parent.id
      const users = await neo4jUserService.getFollowersList(userId)

      return mapUsers(users)
    },
  }
}
