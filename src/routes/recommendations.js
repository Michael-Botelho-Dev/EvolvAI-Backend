import { Router } from 'express'
import { readDB } from '../db.js'
import { recomendarConteudo } from '../recommend.js'
const router = Router()

// GET /api/recommendations?userId=1
router.get('/recommendations', (req, res) => {
  const db = readDB()
  const user = db.users.find(u => String(u.id) === String(req.query.userId || 1)) || db.users[0]
  const result = recomendarConteudo(user, db.trilhas, db.catalogo)
  res.json(result)
})

export default router