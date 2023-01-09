import { GraphQLError } from 'graphql'

export class UserIncorrectIdError extends GraphQLError {
  constructor() {
    super('Incorrect user\'s id.', {
      extensions: {
        code: 'BAD_USER_INPUT'
      }
    })
  }
}
