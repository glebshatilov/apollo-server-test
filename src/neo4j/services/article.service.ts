import { toNativeTypes } from '../utils.js'
import { int } from 'neo4j-driver'

export default class ArticleService {

  driver

  constructor(driver) {
    this.driver = driver
  }

  async add(title, text, authorId) {
    const session = this.driver.session()

    try {
      const res = await session.executeWrite(tx => tx.run(
        `
        MATCH (u:User)
        WHERE u.id = $authorId

        MERGE (a:Article {
        id: randomUuid(),
        title: $title,
        text: $text,
        createdAt: datetime(),
        updatedAt: datetime()
        })-[:AUTHORED_BY]->(u)

        RETURN a { .* } AS article
        `,
        { title, text, authorId }
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

  async getAllByAuthor(authorId) {
    const session = this.driver.session()

    try {
      const res = await session.executeRead(tx => tx.run(
          `
        MATCH (u:User { id: $authorId })<-[:AUTHORED_BY]-(a)
        RETURN a {
          .*
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
}
