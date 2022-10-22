import path from 'path'
import { createDb, migrate } from 'postgres-migrations'
import config from './config'
import logger from './logger'

const migrations = async () => {
  try {
    await migrate(config.db, path.resolve('./db_migrations'))
  } catch (err) {
    logger.error('Error populating servers', { error: err })
  }
}

export default migrations
