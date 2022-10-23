import { schema as ArticleSchema } from './domains/article/index.js'
import { schema as UserSchema } from './domains/user/index.js'
import { mergeSchemas } from '@graphql-tools/schema'

const schema = mergeSchemas({
  schemas: [
    UserSchema,
    ArticleSchema
  ]
})

export default schema
