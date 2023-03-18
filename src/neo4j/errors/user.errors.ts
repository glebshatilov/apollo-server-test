export class Neo4jUserEmailUniqueViolationError extends Error {
  argumentName = 'email'
  code = 'UNIQUE_VIOLATION'
  constructor() {
    super('This email is already in use.')
  }
}

export class Neo4jUserUsernameUniqueViolationError extends Error {
  argumentName = 'username'
  code = 'UNIQUE_VIOLATION'
  constructor() {
    super('This username is already in use.')
  }
}
