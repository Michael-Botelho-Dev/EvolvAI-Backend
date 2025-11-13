import { Router } from 'express'
import { readDB } from '../db.js'
const router = Router()

router.get('/ranking', (_req, res) => {
  const db = readDB()
  res.json(db.ranking)
})

export default router