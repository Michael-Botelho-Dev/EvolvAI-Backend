import { Router } from 'express'
import { readDB, writeDB } from '../db.js'

const router = Router()

// POST /api/events  { userId, type, meta? }
router.post('/events', (req, res) => {
  const { userId, type, meta } = req.body || {}
  if (!userId || !type) return res.status(400).json({ error: 'userId e type são obrigatórios' })
  const db = readDB()
  db.events = db.events || []
  db.events.push({ ts: Date.now(), userId, type, meta: meta || {} })
  writeDB(db)
  res.status(201).json({ ok: true })
})

export default router
