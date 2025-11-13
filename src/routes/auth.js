import { Router } from 'express'
import { readDB, writeDB } from '../db.js'

const router = Router()

// POST /api/login  { nome: string, nivel: 'iniciante'|'intermediario'|'avancado' }
router.post('/login', (req, res) => {
  const { nome, nivel = 'iniciante' } = req.body || {}
  if (!nome || typeof nome !== 'string' || !nome.trim()) {
    return res.status(400).json({ error: 'Nome é obrigatório.' })
  }
  const nomeNorm = nome.trim()

  const db = readDB()
  db.users = db.users || []

  // tenta achar usuário pelo nome (case-insensitive)
  const idx = db.users.findIndex(u => (u.nome || '').toLowerCase() === nomeNorm.toLowerCase())

  if (idx >= 0) {
    // Atualiza nível se mudou; mantém XP/streak
    const updated = { ...db.users[idx], nivel }
    db.users[idx] = updated
    writeDB(db)
    return res.json(updated)
  }

  // Novo usuário: gera id sequencial
  const nextId = (db.users.length ? Math.max(...db.users.map(u => Number(u.id) || 0)) : 0) + 1
  const novo = { id: nextId, nome: nomeNorm, nivel, xp: 0, streakDias: 0 }

  db.users.push(novo)
  writeDB(db)
  return res.status(201).json(novo)
})

export default router