import { toNativeTypes } from '../utils.js'
import { int } from 'neo4j-driver'
import { PaginationInputInterface } from '../../@types/common.js'

export default class Neo4jMessagesService {

  driver

  constructor(driver) {
    this.driver = driver
  }

  async checkUserIsChatParticipant(chatId: string, userId: string) {
    const session = this.driver.session()

    try {
      const res = await session.executeRead(tx => tx.run(
        `
        MATCH (u:User { id: $userId })-[r:IN_CHAT]->({id: $chatId})
        RETURN r
        `,
        {
          userId,
          chatId
        }
      ))

      return res.records.length > 0
    } catch (e) {
      console.error('e checkUserIsCharParticipant', e)
    } finally {
      await session.close()
    }
  }

  async updateChatLastMessageDate(chatId: string) {
    const session = this.driver.session()

    try {
      const res = await session.executeWrite(tx => tx.run(
        `
        MATCH (c:DirectMessagesChat { id: $chatId })
        SET c.lastMessageAt = datetime()
        RETURN c { .* } AS chat
        `,
        {
          chatId
        }
      ))

      return res.records.length > 0
    } catch (e) {
      console.error('e checkUserIsCharParticipant', e)
    } finally {
      await session.close()
    }
  }

  async getOrCreateDirectMessagesChatByUserIds(firstUserId: string, secondUserId: string) {
    const session = this.driver.session()

    try {
      const res = await session.executeWrite(tx => tx.run(
        `
        MATCH (u1:User { id: $firstUserId }), (u2:User { id: $secondUserId })

        MERGE (u1)-[:IN_CHAT]->(c:DirectMessagesChat)<-[:IN_CHAT]-(u2)
        ON CREATE
        SET c.id = randomUuid(), c.createdAt = datetime(), c.updatedAt = datetime()

        RETURN c {
          .*,
          participants: [ u1 { .* }, u2 { .* }],
          labels: labels(c)
          } AS chat
        `,
        { firstUserId, secondUserId }
      ))

      if (res.records.length === 0) {
        console.error('Couldn\'t find or create chat.')
        return null
      }

      return res.records[0].get('chat')
    } catch (e) {
      console.error('e getOrCreateDirectMessagesChatByUserIds', e)
    } finally {
      await session.close()
    }
  }

  async getAllChatsByUserId(userId: string, pagination?: PaginationInputInterface) {
    const session = this.driver.session()

    try {
      const res = await session.executeRead(tx => tx.run(
        `
        MATCH (:User { id: $userId })-[:IN_CHAT]->(c)
        WHERE c.lastMessageAt IS NOT NULL

        WITH c ORDER BY c.lastMessageAt DESC
        ${pagination ? 'SKIP $skip LIMIT $limit' : ''}

        MATCH (u:User)-[:IN_CHAT]->(c)

        WITH collect(u { .* }) AS participants, c

        RETURN c {
          .*,
          labels: labels(c),
          participants
        } AS chat
        `,
        {
          userId,
          ...(pagination && {
            limit: int(pagination.limit),
            skip: int(pagination.skip)
          })
        }
      ))

      const chats = res.records.map(
        row => toNativeTypes(row.get('chat'))
      )

      return chats
    } catch (e) {
      console.error('e getAllChatsByUserId', e)
    } finally {
      await session.close()
    }
  }
}
