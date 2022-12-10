import path from 'path'
import { fileURLToPath } from 'url';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { loadFiles } from '@graphql-tools/load-files'

export function dirnameByFileUrl(fileUrl) {
  const __filename = fileURLToPath(fileUrl);
  return path.dirname(__filename);
}

export async function makeSchemaForDomain(fileUrl) {
  const resolversArray = await loadFiles(path.join(dirnameByFileUrl(fileUrl), './resolvers'), { ignoreIndex: true })
  const typeDefsArray = await loadFiles(path.join(dirnameByFileUrl(fileUrl), './typeDefs'), { ignoreIndex: true })

  return makeExecutableSchema({
    resolvers: mergeResolvers(resolversArray),
    typeDefs: mergeTypeDefs(typeDefsArray)
  })
}

export async function makeFullSchema(fileUrl) {
  const resolversArray = await loadFiles([
    path.join(dirnameByFileUrl(fileUrl), './domains/!(_default)/**/resolvers/*.{js,ts}'), // load all resolvers from domains except _default
    path.join(dirnameByFileUrl(fileUrl), './common/**/resolvers/*.{js,ts}'), // load all resolvers from common folder
  ], { ignoreIndex: true })

  const typeDefsArray = await loadFiles([
    path.join(dirnameByFileUrl(fileUrl), './domains/!(_default)/**/typeDefs/*.graphql'), // load all typeDefs from domains except _default
    path.join(dirnameByFileUrl(fileUrl), './common/**/typeDefs/*.graphql'), // load all typeDefs from common folder
  ], { ignoreIndex: true })

  return makeExecutableSchema({
    resolvers: mergeResolvers(resolversArray),
    typeDefs: mergeTypeDefs(typeDefsArray)
  })
}
