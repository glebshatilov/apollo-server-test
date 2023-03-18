import Neo4jUserService from '../../../../neo4j/services/user.service.js'
import { UnauthorizedError } from '../../../errors/auth.error.js'
import { validateUserEmail, validateUserName, validateUserUsername } from '../../../utils/validation.js'

export default {
  Mutation: {
    user: async () => ({
      updateInfo: async ({ data }, { neo4jDriver, authUser }) => {
        if (!authUser?.id) throw new UnauthorizedError()

        // Validate input data
        validateUserName(data.name)
        validateUserEmail(data.email)
        validateUserUsername(data.username)

        const neo4jUserService = new Neo4jUserService(neo4jDriver)

        const user = await neo4jUserService.updateUserInfo(authUser.id, data)

        return {
          code: '200',
          success: true,
          user
        }
      },
      startFollowing: async ({ userId }, { neo4jDriver, authUser }) => {
        if (!authUser?.id) throw new UnauthorizedError()

        const neo4jUserService = new Neo4jUserService(neo4jDriver)

        const user = await neo4jUserService.addFollower(userId, authUser.id)

        return {
          code: '200',
          success: true,
          user
        }
      },
      stopFollowing: async ({ userId }, { neo4jDriver, authUser }) => {
        if (!authUser?.id) throw new UnauthorizedError()

        const neo4jUserService = new Neo4jUserService(neo4jDriver)

        const user = await neo4jUserService.removeFollower(userId, authUser.id)

        return {
          code: '200',
          success: true,
          user
        }
      }
    })
  }
}
