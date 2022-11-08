import { db } from './db'
import logger from './logger'

const clearPortalInterval = () =>
  setInterval(async () => {
    try {
      await db.dbQuery(`
        DELETE FROM portals WHERE expires < NOW() AND size <> 4200;
        DELETE FROM portals WHERE size = 0 AND
          conn1 NOT IN (SELECT conn1 FROM portals WHERE size <> 0 AND size <> 4200) AND
          conn1 NOT IN (SELECT conn2 FROM portals WHERE size <> 0 AND size <> 4200) AND
          conn2 NOT IN (SELECT conn1 FROM portals WHERE size <> 0 AND size <> 4200) AND
          conn2 NOT IN (SELECT conn2 FROM portals WHERE size <> 0 AND size <> 4200);
      `)
    } catch (err: any) {
      logger.error('Error deleting expired portals, impossible error???', {
        error: err,
      })
    }
  }, 10000)

export default clearPortalInterval
