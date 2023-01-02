import Neo4jUserService from '../../../../neo4j/services/user.service.js'

export default {
  Search: {
    users: async (parent, { query }, { neo4jDriver }) => {
      const neo4jUserService = new Neo4jUserService(neo4jDriver)

      const users = await neo4jUserService.findUsersByQuery(query)

      return {
        list: users
      }
    }
  }
}
