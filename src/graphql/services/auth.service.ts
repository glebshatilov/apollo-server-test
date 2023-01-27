import jwt from 'jsonwebtoken'
import { hash, compare } from 'bcrypt'
import {
  JWT_SECRET,
  JWT_EXPIRE_TIME,
  SALT_ROUNDS
} from '../../utils/variables.js'
import { TokenExpiredError } from '../errors/auth.error.js'

export default class AuthService {
  async hashPassword(password) {
    return await hash(password, parseInt(SALT_ROUNDS))
  }

  async comparePasswords(unencryptedPassword, encryptedPassword) {
    return await compare(unencryptedPassword, encryptedPassword)
  }

  makeJwt(payload) {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: parseInt(JWT_EXPIRE_TIME)
    })
  }

  verifyJwt(token) {
    try {
      return jwt.verify(token, JWT_SECRET, {
        maxAge: parseInt(JWT_EXPIRE_TIME)
      })
    } catch (e) {
      let tokenError
      switch (e.name) {
        case 'TokenExpiredError':
          tokenError = {
            code: 'TOKEN_EXPIRED'
          }
          break
        case 'JsonWebTokenError':
          tokenError = {
            code: 'INVALID_TOKEN'
          }
          break
        default:
          tokenError = {
            code: 'TOKEN_ERROR'
          }
      }

      return {
        tokenError
      }
    }
  }

  getUserDataByReq(req) {
    const authorizationHeader = req.headers.authorization || req.headers?.get?.('authorization') // via get() for subscriptions logic

    if (!authorizationHeader) return null

    const [ type, token ] = authorizationHeader.split(' ')

    if (type !== 'Bearer' || !token) {
      return {
        tokenError: {
          code: 'INVALID_TOKEN'
        }
      }
    }

    return this.verifyJwt(token)
  }
}
