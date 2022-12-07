import AuthService from '../../../../neo4j/services/auth.service.js'

export default {
  Mutation: {
    register: async (parent, { email, name }, { neo4jDriver }) => {
      const authService = new AuthService(neo4jDriver)
      const newUser = await authService.register(email, name)

      return newUser
    }
  }
}
