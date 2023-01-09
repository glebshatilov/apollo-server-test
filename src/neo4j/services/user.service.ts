import { toNativeTypes } from '../utils.js'

export default class Neo4jUserService {

  driver

  constructor(driver) {
    this.driver = driver
  }

  async createUser(email, password) {
    const session = this.driver.session()

    try {
      const res = await session.executeWrite(
        tx => tx.run(
          `
        CREATE (u:User {
          id: randomUuid(),
          email: $email,
          password: $password,
          createdAt: datetime(),
          updatedAt: datetime()
        })
        RETURN u
      `,
          {
            email,
            password
          }
        )
      )

      const [first] = res.records
      const node = first.get('u')

      return {
        ...node.properties
      }
    }

    catch (e) {
      if (e.code === 'Neo.ClientError.Schema.ConstraintValidationFailed') {
        console.log('ConstraintValidationFailed')
        // throw new ValidationError(
        //   `An account already exists with the email address ${email}`,
        //   {
        //     email: 'Email address already taken'
        //   }
        // )
      }

      throw e
    }

    finally {
      await session.close()
    }
  }

  async getUserById(id: string) {
    const session = this.driver.session()

    try {
      const res = await session.executeRead(tx => tx.run(
        `
        MATCH (u:User { id: $id })
        RETURN u { .* } AS user
        `,
        { id }
      ))

      if (res.records.length === 0) {
        return null
      }

      return res.records[0].get('user')
    } catch (e) {

    } finally {
      await session.close()
    }
  }

  async getUserByEmail(email) {
    const session = this.driver.session()

    try {
      const res = await session.executeRead(tx => tx.run(
        `
        MATCH (u:User { email: $email })
        RETURN u { .* } AS user
        `,
        { email }
      ))

      if (res.records.length === 0) {
        return null
      }

      return res.records[0].get('user')
    } catch (e) {

    } finally {
      await session.close()
    }
  }

  async updateUserInfo(userId, data) {
    const session = this.driver.session()

    const modifiedData = {
      ...data,
      ...(!!data.name && { lowerCaseName: data.name.toLowerCase() }) // add property lowerCaseName
    }

    try {
      const res = await session.executeWrite(tx => tx.run(
        `
        MATCH (u:User { id: $userId })
        SET u += $data
        SET u.updatedAt = datetime()
        RETURN u { .* } AS user
        `,
        { userId, data: modifiedData }
      ))

      if (res.records.length === 0) {
        return null
      }

      return res.records[0].get('user')
    } catch (e) {
      console.log('error', e)
    } finally {
      await session.close()
    }
  }

  async addFollower(userId: string, followerId: string) {
    const session = this.driver.session()

    try {
      const res = await session.executeWrite(tx => tx.run(
        `
        MATCH (f:User { id: $followerId }), (u:User { id: $userId })

        MERGE (f)-[r:FOLLOWING]->(u)
        ON CREATE
        SET r.createdAt = datetime()

        RETURN f { .* } AS user
        `,
        { userId, followerId }
      ))

      if (res.records.length === 0) {
        return null
      }

      return res.records[0].get('user')
    } catch (e) {
      console.log('addFollowerError', e)
    } finally {
      await session.close()
    }
  }

  async removeFollower(userId: string, followerId: string) {
    const session = this.driver.session()

    try {
      const res = await session.executeWrite(tx => tx.run(
        `
        MATCH (f:User { id: $followerId })-[r:FOLLOWING]->(u:User { id: $userId })

        DELETE r

        RETURN f { .* } AS user
        `,
        { userId, followerId }
      ))

      if (res.records.length === 0) {
        return null
      }

      return res.records[0].get('user')
    } catch (e) {
      console.log('removeFollowerError', e)
    } finally {
      await session.close()
    }
  }

  async getFollowersList(userId: string) {
    const session = this.driver.session()

    try {
      const res = await session.executeRead(tx => tx.run(
        `
        MATCH (f:User)-[:FOLLOWING]->(u: User { id: $userId })

        RETURN u {
        .*
        } AS user
        `,
        { userId }
      ))

      const users = res.records.map(
        row => toNativeTypes(row.get('user'))
      )

      return users
    } catch (e) {
      console.error('getFollowersListError', e)
    } finally {
      await session.close()
    }
  }

  async getFollowingList(userId: string) {
    const session = this.driver.session()

    try {
      const res = await session.executeRead(tx => tx.run(
        `
        MATCH (f:User { id: $userId })-[:FOLLOWING]->(u:User)

        RETURN u {
        .*
        } AS user
        `,
        { userId }
      ))

      const users = res.records.map(
        row => toNativeTypes(row.get('user'))
      )

      return users
    } catch (e) {
      console.error('getFollowingListError', e)
    } finally {
      await session.close()
    }
  }

  async getAll() {
    const session = this.driver.session()

    try {
      const res = await session.executeRead(tx => tx.run(
          `
        MATCH (u:User)
        RETURN u {
          .*
        } AS user
      `
        )
      )

      const users = res.records.map(
        row => toNativeTypes(row.get('user'))
      )

      return users
    } catch (e) {
      console.log('UserServiceError', e)
      throw e
    } finally {
      await session.close()
    }
  }

  async findUsersByQuery(query: string) {
    const session = this.driver.session()

    try {
      const res = await session.executeRead(tx => tx.run(
        `
        WITH toLower($query) AS lowerCaseQuery
        MATCH (u:User)
        WHERE u.username CONTAINS lowerCaseQuery
          OR u.lowerCaseName CONTAINS lowerCaseQuery

        RETURN u { .* } AS user
        `,
        { query }
      ))

      const users = res.records.map(
        row => toNativeTypes(row.get('user'))
      )

      return users

    } catch (e) {
      console.error('findUsersByQueryError', e)
    } finally {
      await session.close()
    }
  }
}
