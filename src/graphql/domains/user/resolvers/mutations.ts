import Neo4jUserService from '../../../../neo4j/services/user.service.js'
import { UnauthorizedError } from '../../../errors/auth.error.js'
import { validateUserEmail, validateUserName, validateUserUsername } from '../../../utils/validation.js'
import { UserUsernameUniqueViolationError, UserEmailUniqueViolationError } from '../../../errors/user.errors.js'
import { mapUser } from '../../../utils/mappers.js'

export default {
  Mutation: {
    user: async () => ({
      updateInfo: async ({ data }, { neo4jDriver, authUser }) => {
        if (!authUser?.id) throw new UnauthorizedError()

        // Validate input data
        if (data.name) validateUserName(data.name)
        if (data.email) validateUserEmail(data.email)
        if (data.username) validateUserUsername(data.username)

        try {
          const neo4jUserService = new Neo4jUserService(neo4jDriver)

          const user = await neo4jUserService.updateUserInfo(authUser.id, data)

          return {
            code: '200',
            success: true,
            user: mapUser(user)
          }
        } catch (error) {
          if (error.code === 'UNIQUE_VIOLATION') {
            if (error.argumentName === 'email') {
              throw new UserEmailUniqueViolationError()
            }

            if (error.argumentName === 'username') {
              throw new UserUsernameUniqueViolationError()
            }
          }

          throw error
        }
      },
      startFollowing: async ({ userId }, { neo4jDriver, authUser }) => {
        if (!authUser?.id) throw new UnauthorizedError()

        const neo4jUserService = new Neo4jUserService(neo4jDriver)

        const user = await neo4jUserService.addFollower(userId, authUser.id)

        return {
          code: '200',
          success: true,
          user: mapUser(user)
        }
      },
      stopFollowing: async ({ userId }, { neo4jDriver, authUser }) => {
        if (!authUser?.id) throw new UnauthorizedError()

        const neo4jUserService = new Neo4jUserService(neo4jDriver)

        const user = await neo4jUserService.removeFollower(userId, authUser.id)

        return {
          code: '200',
          success: true,
          user: mapUser(user)
        }
      }
    })
  }
}
