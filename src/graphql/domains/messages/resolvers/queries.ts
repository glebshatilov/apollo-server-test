import { Message } from '../../../../orm/entities/Message.js'

export default {
  Query: {
    messages: async (parent, args, { em }) => {
      const messages = await em.find(Message, {})

      return messages
    }
  }
}
