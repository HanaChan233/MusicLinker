import { Router } from 'express'
import { verifyJwt } from '../util/auth.js'
import { select } from '../db/ops.js'

const router = Router()

router.get('/me', verifyJwt, (req, res) => {
  const rows = select('SELECT id, username FROM users WHERE id = ? AND deleted = 0', [req.user.sub])
  const row = rows[0]
  if (!row) return res.status(404).json({ error: 'user not found' })
  res.json(row)
})

export default router


