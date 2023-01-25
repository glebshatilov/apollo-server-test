import { GraphQLError } from 'graphql'

export class MessagesNoChatIdOrUserIdError extends GraphQLError {
  constructor() {
    super('Provide chatId or userId.', {
      extensions: {
        code: 'BAD_USER_INPUT'
      }
    })
  }
}

export class MessagesNoMessageIdError extends GraphQLError {
  constructor() {
    super('Provide messageId.', {
      extensions: {
        code: 'BAD_USER_INPUT'
      }
    })
  }
}

export class MessagesIncorrectMessageIdError extends GraphQLError {
  constructor() {
    super('Incorrect messageId.', {
      extensions: {
        code: 'BAD_USER_INPUT'
      }
    })
  }
}

export class MessagesNoPermissionError extends GraphQLError {
  constructor() {
    super('No permissions.', {
      extensions: {
        code: 'BAD_USER_INPUT'
      }
    })
  }
}
