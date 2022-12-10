// import ValidationError from '../errors/validation.error.js'

export default class AuthService {

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
  //
  // async authenticate(email, unencryptedPassword) {
  //   const session = this.driver.session()
  //
  //   try {
  //     const res = await session.executeRead(tx => tx.run(
  //       'MATCH (u:User {email: $email}) RETURN u',
  //       { email }
  //     ))
  //
  //     await session.close()
  //
  //     if (res.records.length === 0) {
  //       return false
  //     }
  //
  //     const user = res.records[0].get('u')
  //     const encryptedPassword = user.properties.password
  //
  //     const correct = await compare(unencryptedPassword, encryptedPassword)
  //
  //     if (correct === false) {
  //       return false
  //     }
  //
  //     const { password, ...safeProperties } = user.properties
  //
  //     return {
  //       ...safeProperties,
  //       token: jwt.sign(this.userToClaims(safeProperties), JWT_SECRET),
  //     }
  //   } catch (e) {
  //     console.log('erro1r', e)
  //   } finally {
  //     await session.close()
  //   }
  //
  //
  // }
  //
  //
  // userToClaims(user) {
  //   const { name, userId } = user
  //
  //   return { sub: userId, userId, name, }
  // }
  //
  // async claimsToUser(claims) {
  //   return {
  //     ...claims,
  //     userId: claims.sub,
  //   }
  // }
}
