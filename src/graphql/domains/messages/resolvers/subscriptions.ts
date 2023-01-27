import { withFilter } from 'graphql-subscriptions'
import { UnauthorizedError } from '../../../errors/auth.error.js'

export default {
  Subscription: {
    newMessageInChat: {
      subscribe: withFilter(
        (_, __, { authUser, pubsub }) => {
          if (!authUser?.id) throw new UnauthorizedError()

          return pubsub.asyncIterator('NEW_MESSAGE_IN_CHAT')
        },
        (payload, _, { authUser }) => {
          if (!authUser?.id) return false
          if (!payload?.newMessageInChat?.participants) return false

          const isInChat = !!payload.newMessageInChat.participants.find(participant => participant.id === authUser.id)

          return isInChat
        }
      )
    }
  }
}
