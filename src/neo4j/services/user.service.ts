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
}
