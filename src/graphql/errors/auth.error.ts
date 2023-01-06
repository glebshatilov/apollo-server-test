import { GraphQLError } from 'graphql'

export class AuthPasswordError extends GraphQLError {
  constructor() {
    super('Incorrect password.', {
      extensions: {
        code: 'UNAUTHORIZED'
      }
    })
  }
}

export class AuthEmailError extends GraphQLError {
  constructor(email: string) {
    super(`No users with email ${email}.`, {
      extensions: {
        code: 'UNAUTHORIZED'
      }
    })
  }
}

export class EmailAlreadyTakenError extends GraphQLError {
  constructor(email: string) {
    super(`An account already exists with the email address ${email}`, {
      extensions: {
        code: 'UNAUTHORIZED'
      }
    })
  }
}

export class TokenExpiredError extends GraphQLError {
  constructor() {
    super('Your jwt-token has expired.', {
      extensions: {
        code: 'TOKEN_EXPIRED'
      }
    })
  }
}

export class AlreadyLoggedInError extends GraphQLError {
  constructor() {
    super('You are already logged in.', {
      extensions: {
        code: 'ALREADY_LOGGED_IN'
      }
    })
  }
}

export class UnauthorizedError extends GraphQLError {
  constructor() {
    super('You have to be logged in.', {
      extensions: {
        code: 'UNAUTHORIZED'
      }
    })
  }
}
