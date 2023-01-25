import { Message } from '../../../../orm/entities/Message.js'
import { UnauthorizedError } from '../../../errors/auth.error.js'
import Neo4jMessagesService from '../../../../neo4j/services/messages.service.js'

export default {
  Query: {
    messages: async () => ({
      all: async (_, { em }) => {
        const messages = await em.find(Message, {})

        return messages.map(message => ({
          ...message,
          author: {
            id: message.authorId
          }
        }))
      },
      allChats: async({ pagination }, { neo4jDriver, authUser, em }) => {
        if (!authUser?.id) throw new UnauthorizedError()

        const neo4jMessagesService = new Neo4jMessagesService(neo4jDriver)

        const chats = await neo4jMessagesService.getAllChatsByUserId(authUser.id, pagination)

        return { // ToDo: add pagination
          data: chats
        }

      },
      chat: async({ userId }, { neo4jDriver, authUser, em }) => {
        if (!authUser?.id) throw new UnauthorizedError()

        const neo4jMessagesService = new Neo4jMessagesService(neo4jDriver)

        const chat = await neo4jMessagesService.getDirectMessagesChatByUserIds(authUser.id, userId)

        return chat

      }
    })
  }
}
