import { Router } from 'express'
import { readDB, writeDB } from '../db.js'

const router = Router()

// GET /api/user/1
router.get('/user/:id', (req, res) => {
  const db = readDB()
  const user = db.users.find(u => String(u.id) === req.params.id)
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' })
  res.json(user)
})

// PATCH /api/user/1  { xp?: number, nivel?: string, streakDias?: number }
router.patch('/user/:id', (req, res) => {
  const db = readDB()
  const idx = db.users.findIndex(u => String(u.id) === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Usuário não encontrado' })

  db.users[idx] = { ...db.users[idx], ...req.body }
  writeDB(db)
  res.json(db.users[idx])
})

export default router