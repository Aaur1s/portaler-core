import { Router } from 'express'
import { db } from '../utils/db'
import logger from '../utils/logger'

const router = Router()

// Lists all our servers
router.get('/list', async (req, res) => {
  try {
    const dbServerRes = await db.dbQuery(
      `SELECT * FROM servers ORDER BY id`,
      []
    )

    const servers = dbServerRes.rows.map((s: any) => ({
      id: s.id,
      discordId: s.discord_id,
      discordName: s.discord_name,
      createdOn: s.created_on,
    }))

    return res.status(200).json(servers)
  } catch (err) {
    logger.error('No Server', {
      error: {
        error: JSON.stringify(err),
        trace: err.stack,
      },
    })
    return res.status(500).send(err)
  }
})

export default router
