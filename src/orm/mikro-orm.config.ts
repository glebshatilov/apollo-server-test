import { defineConfig } from '@mikro-orm/mysql'
import path from 'path'
import { dirnameByFileUrl } from '../utils/dir.js'
import { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE_NAME } from '../utils/variables.js'

export default defineConfig({
  entities: ['./dist/orm/entities', './orm/entities'], // path to our JS entities, without `dist` for production
  entitiesTs: ['./src/orm/entities'], // path to our TS entities (src), relative to `baseDir`
  migrations: {
    path: path.join(dirnameByFileUrl(import.meta.url), './migrations'),
  },
  type: 'mysql',
  host: MYSQL_HOST,
  port: Number(MYSQL_PORT),
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  dbName: MYSQL_DATABASE_NAME,
  debug: true,
})
