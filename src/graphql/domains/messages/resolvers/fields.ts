import { Message } from '../../../../orm/entities/Message.js'
import { QueryOrder } from '@mikro-orm/core'
import { UnauthorizedError } from '../../../errors/auth.error.js'

export default {
  Chat: {
    __resolveType: async (chat) => {
      if (chat.labels.includes('DirectMessagesChat')) {
        return 'DirectMessagesChat'
      }

      if (chat.labels.includes('GroupMessagesChat')) {
        return 'GroupMessagesChat'
      }

      return null
    }
  },
  DirectMessagesChat: {
    interlocutor: async (parent, _, { em, authUser }) => {
      if (!authUser?.id) throw new UnauthorizedError()

      if (parent.participants) {
        return parent.participants.find(user => user.id !== authUser.id) || null
      }

      // ToDo: add request to database
      return null
    },
    lastMessage: async (parent, _, { em }) => {
      const message = await em.findOne(Message, { chatId: parent.id }, { orderBy: { createdAt: QueryOrder.DESC }})

      return message
    },
    messages: async (parent, { pagination }, { em }) => {
      const [messages, count] = await em.findAndCount(Message, { chatId: parent.id }, {
        orderBy: { createdAt: QueryOrder.DESC },
        ...(pagination && {
          skip: pagination.skip,
          limit: pagination.limit,
        })
      })

      return {
        pagination: {
          count,
          skip: pagination?.skip ?? null,
          limit: pagination?.limit ?? null
        },
        data: messages
      }
    }
  }
}
