// import { schema as UserSchema } from './domains/user/index.js'
// import { schema as ArticleSchema } from './domains/article/index.js'
// import { mergeSchemas } from '@graphql-tools/schema'

import { makeFullSchema } from '../utils/schema.js'

const schema = await makeFullSchema(import.meta.url)

// const schema = mergeSchemas({
//   schemas: [
//     UserSchema,
//     ArticleSchema
//   ]
// })

export default schema
