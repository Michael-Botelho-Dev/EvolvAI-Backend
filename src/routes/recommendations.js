import { Router } from 'express'
import { readDB } from '../db.js'

const router = Router()

// Base do serviço Python (FastAPI). Configure no .env se quiser outra porta.
const PY_RECO_URL = process.env.PY_RECO_URL || 'http://127.0.0.1:8000'

function recomendarJS(user, trilhas, catalogo) {
  // Fallback heurístico idêntico ao usado no Python
  const trilhaTags = new Set(trilhas.flatMap(t => t.tags || []))
  const items = catalogo.map(c => {
    let score = 0
    if (user.nivel === 'iniciante' && c.nivel === 'iniciante') score += 1
    else if (user.nivel !== 'iniciante' && c.nivel !== 'iniciante') score += 1
    if ((c.tags || []).some(t => trilhaTags.has(t))) score += 1
    if ((c.duracao || 999) <= 20) score += 1
    return { ...c, score }
  })
  items.sort((a, b) => b.score - a.score || a.duracao - b.duracao)
  return items.slice(0, 10)
}

router.get('/recommendations', async (req, res) => {
  try {
    const userId = Number(req.query.userId || 1)
    const db = readDB()

    const user = db.users.find(u => Number(u.id) === userId) || db.users?.[0]
    const trilhas = db.trilhas || []
    const catalogo = db.catalogoConteudos || []

    // Tenta o serviço Python primeiro
    try {
      const pyRes = await fetch(`${PY_RECO_URL}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user,
          trilhas,
          catalogo,
          k: 10
        })
      })

      if (pyRes.ok) {
        const data = await pyRes.json()
        return res.json(data.items || [])
      } else {
        const txt = await pyRes.text()
        console.warn('[PY-RECO] HTTP', pyRes.status, txt)
      }
    } catch (e) {
      console.warn('[PY-RECO] Falha ao conectar:', e.message)
    }

    // Fallback JS se Python indisponível
    const local = recomendarJS(user, trilhas, catalogo)
    return res.json(local)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Erro ao gerar recomendações' })
  }
})

export default router
