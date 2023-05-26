import { toNativeTypes } from '../utils.js'
import { PaginationInputInterface } from '../../@types/common.js'
import { int } from 'neo4j-driver'

export default class Neo4jArticleService {

  driver

  constructor(driver) {
    this.driver = driver
  }

  async add(title, content, authorId) {
    const session = this.driver.session()

    try {
      const res = await session.executeWrite(tx => tx.run(
        `
        MATCH (u:User)
        WHERE u.id = $authorId

        MERGE (a:Article {
        id: randomUuid(),
        title: $title,
        content: $content,
        createdAt: datetime(),
        updatedAt: datetime()
        })-[:AUTHORED_BY]->(u)

        RETURN a {
          .*,
          author: u { .* }
        } AS article
        `,
        { title, content, authorId }
      ))

      if (res.records.length === 0) {
        throw new Error('Error occurred!')
      }

      const [ article ] = res.records

      return toNativeTypes(article.get('article'))
    } catch (e) {
      console.log('ArticleServiceError', e)
      throw e
    } finally {
      await session.close()
    }
  }

  async getAll(pagination: PaginationInputInterface) {
    const session = this.driver.session()

    try {
      const res = await session.executeRead(tx => tx.run(
          `
        MATCH (a:Article)-[:AUTHORED_BY]->(u)

        WITH u, a ORDER BY a.createdAt DESC
        ${pagination ? 'SKIP $skip LIMIT $limit' : ''}

        RETURN a {
          .*,
          author: u { .* }
        } AS article
      `,
          {
            ...(pagination && {
              limit: int(pagination.limit),
              skip: int(pagination.skip)
            })
          }
        )
      )

      const articles = res.records.map(
        row => toNativeTypes(row.get('article'))
      )

      return articles
    } catch (e) {
      console.log('Articles.getAll.error', e)
      throw e
    } finally {
      await session.close()
    }
  }

  async getAllByAuthor(authorId) {
    const session = this.driver.session()

    try {
      const res = await session.executeRead(tx => tx.run(
          `
        MATCH (u:User { id: $authorId })<-[:AUTHORED_BY]-(a)
        RETURN a {
          .*,
          author: u { .* }
        } AS article
      `,
        {
          authorId
        }
        )
      )

      const articles = res.records.map(
        row => toNativeTypes(row.get('article'))
      )

      return articles
    } catch (e) {
      console.log('UserServiceError', e)
      throw e
    } finally {
      await session.close()
    }
  }

  async getAuthor(articleId) {
    const session = this.driver.session()

    try {
      const res = await session.executeRead(tx => tx.run(
          `
        MATCH (u:User)<-[:AUTHORED_BY]-(a:Article { id: $articleId })
        RETURN u {
          .*
        } AS author
      `,
          {
            articleId
          }
        )
      )

      if (res.records.length === 0) {
        throw new Error('Can\'t find an author.')
      }

      const author = toNativeTypes(res.records[0].get('author'))

      return author
    } catch (e) {
      console.log('UserServiceError', e)
      throw e
    } finally {
      await session.close()
    }
  }

  async addLike(articleId: string, userId:string) {
    const session = this.driver.session()

    try {
      const res = await session.executeWrite(tx => tx.run(
        `
        MATCH (u:User { id: $userId }), (a:Article { id: $articleId })

        MERGE (u)-[r:LIKES]->(a)
        ON CREATE
        SET r.createdAt = datetime()

        RETURN a { .* } AS article
        `,
        {
          userId,
          articleId
        }
      ))

      if (res.records.length === 0) {
        return null // ToDo: error, can't find article with provided id
      }

      return res.records[0].get('article')
    } catch (e) {
      console.error('addLikeError', e)
    } finally {
      await session.close()
    }
  }

  async removeLike(articleId: string, userId:string) {
    const session = this.driver.session()

    try {
      const res = await session.executeWrite(tx => tx.run(
        `
        MATCH (u:User { id: $userId })-[r:LIKES]->(a:Article { id: $articleId })

        DELETE r

        RETURN a { .* } AS article
        `,
        {
          userId,
          articleId
        }
      ))

      if (res.records.length === 0) {
        return null
      }

      return res.records[0].get('article')
    } catch (e) {
      console.error('addLikeError', e)
    } finally {
      await session.close()
    }
  }
}
