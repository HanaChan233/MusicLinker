import jwt from 'jsonwebtoken'

export function verifyJwt(req, res, next) {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const secret = process.env.JWT_SECRET || 'dev-secret'
    req.user = jwt.verify(token, secret)
    next()
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}


