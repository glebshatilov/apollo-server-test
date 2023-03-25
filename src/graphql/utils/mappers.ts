export const createImageObject = (src) => {
  if (!src) return null

  return {
    src,
  }
}

export const mapUser = (user) => {
  if (!user) return null
  return {
    ...user,
    avatar: createImageObject(user.avatar)
  }
}

export const mapUsers = (users) => {
  return users.map(user => mapUser(user))
}
