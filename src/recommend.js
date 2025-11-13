export function recomendarConteudo(user, trilhas, catalogo) {
  const tagsPrioritarias = new Set(
    trilhas
      .filter(t => user.nivel === 'iniciante' ? true : t.nivel !== 'iniciante')
      .flatMap(t => t.tags)
  )

  return catalogo
    .filter(c => (user.nivel === 'iniciante' ? c.nivel === 'iniciante' : true))
    .map(c => ({
      ...c,
      score: c.tags.some(tg => tagsPrioritarias.has(tg)) ? 1 : 0
    }))
    .sort((a, b) => b.score - a.score || a.duracao - b.duracao)
    .slice(0, 10)
}