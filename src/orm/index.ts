import type { MySqlDriver } from '@mikro-orm/mysql'
import { MikroORM } from '@mikro-orm/core'
import mikroOrmConfig from './mikro-orm.config.js'

export async function initORM() {
  const orm = await MikroORM.init<MySqlDriver>(mikroOrmConfig)
  await orm.getMigrator().up()

  return orm
}
