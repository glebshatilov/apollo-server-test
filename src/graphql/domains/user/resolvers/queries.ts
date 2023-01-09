import Neo4jUserService from '../../../../neo4j/services/user.service.js'
import { UnauthorizedError } from '../../../errors/auth.error.js'
import { UserIncorrectIdError } from '../../../errors/user.error.js'

export default {
  Query: {
    user: async (parent, { id }, { neo4jDriver, authUser }) => {
      const neo4jUserService = new Neo4jUserService(neo4jDriver)

      if (id) {
        const user = await neo4jUserService.getUserById(id)

        if (!user) throw new UserIncorrectIdError()

        return user
      } else {
        if (!authUser?.id) throw new UnauthorizedError()

        const user = await neo4jUserService.getUserById(authUser.id)

        if (!user) throw new UserIncorrectIdError()

        return user
      }
    },
    users: async (parent, args, { neo4jDriver }) => {
      const neo4jUserService = new Neo4jUserService(neo4jDriver)

      const users = await neo4jUserService.getAll()

      return users
    }
  }
}
