import validator from 'validator'
import { UserNameLengthValidationError, UserEmailValidationError, UserUsernameLengthValidationError } from '../errors/user.errors.js'

export const validateUserEmail = (email: string): void => {
  if (!email || !validator.isEmail(email)) {
    throw new UserEmailValidationError()
  }
}

export const validateUserName = (name: string): void => {
  if (!name || name.length < 4) {
    throw new UserNameLengthValidationError()
  }
}

export const validateUserUsername = (username: string | undefined): void => {
  if (username && username.length < 4) {
    throw new UserUsernameLengthValidationError()
  }
}
