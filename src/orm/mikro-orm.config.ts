import { defineConfig } from '@mikro-orm/mysql'
import path from 'path'
import { dirnameByFileUrl } from '../utils/dir.js'

export default defineConfig({
  entities: ['./dist/orm/entities'], // path to our JS entities (dist), relative to `baseDir`
  entitiesTs: ['./src/orm/entities'], // path to our TS entities (src), relative to `baseDir`
  migrations: {
    path: path.join(dirnameByFileUrl(import.meta.url), './migrations'),
  },
  dbName: 'apollo_server_test',
  user: 'testuser',
  password: 'testuser',
  type: 'mysql',
  debug: true,
})
