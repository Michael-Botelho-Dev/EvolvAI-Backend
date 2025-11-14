// src/routes/insights.js
import { Router } from 'express'
import { readDB } from '../db.js'

const router = Router()

function recomendarJS(user, trilhas, catalogo, k = 10) {
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
  return items.slice(0, k)
}

router.get('/insights', (req, res) => {
  const userId = Number(req.query.userId || 1)
  const db = readDB()

  const users = db.users || []
  const trilhas = db.trilhas || []
  const missoes = db.missoes || []
  const catalogo = db.catalogoConteudos || []

  const user = users.find(u => Number(u.id) === userId) || users[0] || {
    id: 1, nome: 'Usuário', nivel: 'iniciante', xp: 0, streakDias: 0
  }

  const nivelCounts = { iniciante: 0, intermediario: 0, avancado: 0 }
  for (const u of users) {
    if (nivelCounts[u.nivel] !== undefined) nivelCounts[u.nivel]++
  }

  const totalMissoes = missoes.length
  const concluidas = missoes.filter(m => m.feito).length
  const taxaConclusao = totalMissoes ? Math.round((concluidas / totalMissoes) * 100) : 0

  const curtos = catalogo.filter(c => (c.duracao || 999) <= 20).length
  const pctCurtos = catalogo.length ? Math.round((curtos / catalogo.length) * 100) : 0

  const recs = recomendarJS(user, trilhas, catalogo, 10)
  const recsCurtos = recs.filter(r => (r.duracao || 999) <= 20).length

  const streaks = users.map(u => u.streakDias || 0)
  const streakMedia = streaks.length ? (streaks.reduce((a,b)=>a+b,0) / streaks.length) : 0
  const streakMax = streaks.length ? Math.max(...streaks) : 0

  const insights = [
    `Conteúdos curtos: ${pctCurtos}% do catálogo têm até 20 min, e ${recsCurtos}/${recs.length} das recomendações seguem esse formato.`,
    `Taxa de conclusão de missões: ${taxaConclusao}%. Sessões curtas ajudam a elevar esse número.`,
    `Distribuição de níveis — Iniciante: ${nivelCounts.iniciante}, Intermediário: ${nivelCounts.intermediario}, Avançado: ${nivelCounts.avancado}.`,
    `Engajamento contínuo — streak médio: ${streakMedia.toFixed(1)} dia(s); máximo: ${streakMax}. Metas semanais podem aumentar.`,
  ]

  return res.json({
    user: { id: user.id, nome: user.nome, nivel: user.nivel },
    nivelCounts,
    missoes: { total: totalMissoes, concluidas, taxaConclusao },
    catalogo: { total: catalogo.length, curtos, pctCurtos },
    recsPreview: recs,
    streak: { media: Number(streakMedia.toFixed(1)), max: streakMax },
    insights
  })
})

export default router
