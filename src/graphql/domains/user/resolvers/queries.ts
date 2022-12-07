import UserService from '../../../../neo4j/services/user.service.js'

export default {
  Query: {
    users: async (parent, args, { neo4jDriver }) => {
      const userService = new UserService(neo4jDriver)

      const users = await userService.getAll()

      return users
    }
  }
}
