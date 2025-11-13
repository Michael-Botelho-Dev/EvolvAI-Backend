import { Router } from 'express'
import { readDB, writeDB } from '../db.js'
const router = Router()

// GET /api/missoes?usuarioId=1
router.get('/missoes', (req, res) => {
  const db = readDB()
  const uid = Number(req.query.usuarioId)
  const lista = uid ? db.missoes.filter(m => m.usuarioId === uid) : db.missoes
  res.json(lista)
})

// PATCH /api/missoes/1  { feito: true }
router.patch('/missoes/:id', (req, res) => {
  const db = readDB()
  const idx = db.missoes.findIndex(m => String(m.id) === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Missão não encontrada' })

  db.missoes[idx] = { ...db.missoes[idx], ...req.body }
  writeDB(db)
  res.json(db.missoes[idx])
})

export default router