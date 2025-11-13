import { Router } from 'express'
import { readDB } from '../db.js'
const router = Router()

router.get('/trilhas', (_req, res) => {
  const db = readDB()
  res.json(db.trilhas)
})

export default router