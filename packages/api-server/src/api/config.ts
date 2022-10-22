import { Router } from 'express'

import { redis } from '../utils/db'
import logger from '../utils/logger'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const serverConfigRes = await redis.getAsync(`server`)
    const serverConfig = serverConfigRes ? JSON.parse(serverConfigRes) : false

    res.status(200).send({
      publicRead: serverConfig.isPublic,
      discordUrl: serverConfig.discordUrl,
    })
  } catch (err) {
    logger.error('Error fetching config', {
      error: {
        error: JSON.stringify(err),
        trace: err.stack,
      },
    })
    res.status(200).send({ publicRead: false, discordUrl: null })
  }
})

export default router
