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

export class UserNameLengthValidationError extends GraphQLError {
  constructor() {
    super('Name must be at least 4 characters long.', {
      extensions: {
        code: 'BAD_USER_INPUT'
      }
    })
  }
}

export class UserEmailValidationError extends GraphQLError {
  constructor() {
    super('Email must be a valid email address.', {
      extensions: {
        code: 'BAD_USER_INPUT'
      }
    })
  }
}

export class UserUsernameLengthValidationError extends GraphQLError {
  constructor() {
    super('Username must be at least 4 characters long.', {
      extensions: {
        code: 'BAD_USER_INPUT'
      }
    })
  }
}
