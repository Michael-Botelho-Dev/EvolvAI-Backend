import { Router } from 'express'
const router = Router()

router.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'evolv-ai-backend' })
})

export default router