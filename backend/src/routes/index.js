import { Router } from 'express'
import authRouter from './auth.js'
import usersRouter from './users.js'
import tracksRouter from './tracks.js'

const router = Router()

router.get('/', (req, res) => res.json({ message: 'API root' }))

router.use('/auth', authRouter)
router.use('/users', usersRouter)
router.use('/tracks', tracksRouter)

export default router


