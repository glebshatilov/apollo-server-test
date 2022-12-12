import Neo4jAuthService from '../../../../neo4j/services/auth.service.js'
import AuthService from '../../../services/auth.service.js'
import { AuthPasswordError, EmailAlreadyTakenError, AlreadyLoggedInError } from '../../../errors/auth.error.js'

export default {
  Mutation: {
    auth: async () => ({
      signUp: async ({ email, password }, { neo4jDriver, authUser }) => {
        if (authUser?.id) throw new AlreadyLoggedInError()

        const neo4jAuthService = new Neo4jAuthService(neo4jDriver)
        const authService = new AuthService()

        const encryptedPassword = await authService.hashPassword(password)

        try {
          const newUser = await neo4jAuthService.createUser(email, encryptedPassword)

          const jwtToken = authService.makeJwt({
            id: newUser.id
          })

          return {
            code: '200',
            success: true,
            user: newUser,
            token: jwtToken
          }
        } catch (e) {
          if (e.code === 'Neo.ClientError.Schema.ConstraintValidationFailed') { // ToDo: handle errors from database in neo4j service
            throw new EmailAlreadyTakenError(email)
          }
        }
      },
      signIn: async ({ email, password }, { neo4jDriver, authUser }) => {
        if (authUser?.id) throw new AlreadyLoggedInError()

        const neo4jAuthService = new Neo4jAuthService(neo4jDriver)
        const authService = new AuthService()

        const user = await neo4jAuthService.getUserByEmail(email)

        const encryptedPassword = user.password

        const isCorrestPassword = await authService.comparePasswords(password, encryptedPassword)

        if (!isCorrestPassword) throw new AuthPasswordError()

        const jwtToken = authService.makeJwt({
          id: user.id
        })

        return {
          code: '200',
          success: true,
          user,
          token: jwtToken
        }
      }
    })
  }
}
