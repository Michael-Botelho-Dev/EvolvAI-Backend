export function recomendarConteudo(user, trilhas, catalogo) {
  const trilhaTags = new Set(trilhas.flatMap(t => t.tags || []))

  return catalogo
    .map(c => {
      let score = 0
      if (user.nivel === 'iniciante' && c.nivel === 'iniciante') score++
      if (user.nivel !== 'iniciante' && c.nivel !== 'iniciante') score++
      if ((c.tags || []).some(t => trilhaTags.has(t))) score++
      if ((c.duracao || 0) <= 20) score++  
      return { ...c, score }
    })
    .sort((a, b) => b.score - a.score || a.duracao - a.duracao)
    .slice(0, 10)
}
