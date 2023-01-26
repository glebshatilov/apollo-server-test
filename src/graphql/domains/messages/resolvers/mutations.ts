import { UnauthorizedError } from '../../../errors/auth.error.js'
import { MessagesNoChatIdOrUserIdError, MessagesNoPermissionError, MessagesNoMessageIdError, MessagesIncorrectMessageIdError } from '../../../errors/mesages.error.js'
import Neo4jMessagesService from '../../../../neo4j/services/messages.service.js'
import { Message } from '../../../../orm/entities/Message.js'

export default {
  Mutation: {
    messages: async () => ({
      send: async ({ text, chatId, userId }, { neo4jDriver, authUser, em }) => {
        if (!authUser?.id) throw new UnauthorizedError()

        const neo4jMessagesService = new Neo4jMessagesService(neo4jDriver)

        if (userId) {
          let chat

          chat = await neo4jMessagesService.getOrCreateDirectMessagesChatByUserIds(authUser.id, userId)

          const message = em.create(Message, { text, chatId: chat.id, authorId: authUser.id })
          await em.persistAndFlush(message)

          await neo4jMessagesService.updateChatLastMessageDate(chat.id)

          return {
            code: '200',
            success: true,
          }
        }

        if (chatId) {
          const isChatParticipant = await neo4jMessagesService.checkUserIsChatParticipant(chatId, authUser.id)

          if (!isChatParticipant) throw new MessagesNoPermissionError()

          const message = em.create(Message, { text, chatId, authorId: authUser.id })
          await em.persistAndFlush(message)

          await neo4jMessagesService.updateChatLastMessageDate(chatId)

          return {
            code: '200',
            success: true,
          }
        }

        throw new MessagesNoChatIdOrUserIdError()
      },
      delete: async ({ messageId }, { neo4jDriver, authUser, em }) => {
        if (!authUser?.id) throw new UnauthorizedError()

        if (!messageId) throw new MessagesNoMessageIdError()

        const message = await em.findOne(Message, messageId)
        if (!message) throw new MessagesIncorrectMessageIdError()
        if (message.authorId !== authUser.id) throw new MessagesNoPermissionError()

        await em.remove(message).flush()

        return {
          code: '200',
          success: true,
        }
      }
    })
  }
}
