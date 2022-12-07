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
  const resolversArray = await loadFiles(path.join(dirnameByFileUrl(fileUrl), './domains/**/resolvers/*.{js,ts}'), { ignoreIndex: true })
  const typeDefsArray = await loadFiles(path.join(dirnameByFileUrl(fileUrl), './domains/**/typeDefs/*.graphql'), { ignoreIndex: true })


  return makeExecutableSchema({
    resolvers: mergeResolvers(resolversArray),
    typeDefs: mergeTypeDefs(typeDefsArray)
  })
}
