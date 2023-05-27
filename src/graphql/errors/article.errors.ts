import { GraphQLError } from 'graphql'

export class ArticleIncorrectIdError extends GraphQLError {
  constructor() {
    super('Incorrect article\'s id.', {
      extensions: {
        code: 'BAD_USER_INPUT',
        argumentName: 'id'
      }
    })
  }
}
