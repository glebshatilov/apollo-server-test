import { toNativeTypes } from '../utils.js'

export default class UserService {

  driver

  constructor(driver) {
    this.driver = driver
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
