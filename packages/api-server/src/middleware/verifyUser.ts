import { NextFunction, Request, Response } from 'express'

import { db, redis } from '../utils/db'
import logger from '../utils/logger'

const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (process.env.DISABLE_AUTH === 'true') {
      req.userId = 1
      req.serverId = 1
      return next()
    }

    const serverConfigRes = await redis.getAsync(`server`)
    const serverConfig = serverConfigRes ? JSON.parse(serverConfigRes) : false

    if (serverConfig && serverConfig.isPublic) {
      req.isPublic = true
      req.serverId = serverConfig.serverId
    }

    if (!req.headers.authorization) {
      if (serverConfig.isPublic) {
        req.userId = 0
        return next()
      }

      return res.sendStatus(401)
    }

    const authHeaders = req.headers.authorization.split(' ')

    if (authHeaders[0] !== 'Bearer') {
      if (serverConfig.isPublic) {
        req.userId = 0
        return next()
      }

      return res.sendStatus(401)
    }

    const token = authHeaders[1]

    const userServer = await redis.getUser(token)

    if (!userServer) {
      if (serverConfig.isPublic) {
        req.userId = 0
        return next()
      }
      return res.sendStatus(403)
    }

    const [userId, serverId0] = userServer.split(':')

    const discordServerId = process.env.DISCORD_SERVER_ID as string

    const serverId1 = ((await db.Server.getServerIdByDiscordId(
      discordServerId
    )) as unknown) as string

    // eslint-disable-next-line eqeqeq
    if (serverId1 != serverId0) {
      if (serverConfig.isPublic) {
        req.userId = 0
        return next()
      }
      return res.sendStatus(403)
    }

    req.userId = Number(userId)
    req.serverId = Number(serverId0)

    next()
  } catch (err) {
    logger.warn('Error verifying user', {
      error: {
        error: JSON.stringify(err),
        trace: err.stack,
      },
    })
    return res.status(500).send({ error: 'Error Verifying User' })
  }
}

export default verifyUser
