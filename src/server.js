import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { readDB, writeDB } from './db.js'
import events from './routes/events.js'

import health from './routes/health.js'
import user from './routes/user.js'
import trilhas from './routes/trilhas.js'
import missoes from './routes/missoes.js'
import ranking from './routes/ranking.js'
import recommendations from './routes/recommendations.js'
import auth from './routes/auth.js' 

dotenv.config()
const app = express()
const PORT = process.env.PORT || 4000

// Middlewares
const ORIGINS = (process.env.ALLOWED_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(s => s.trim());

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true); // curl/insomnia
    if (ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS: ' + origin));
  }
}));
app.use(express.json())

// Rotas
app.use('/api', health)
app.use('/api', user)
app.use('/api', trilhas)
app.use('/api', missoes)
app.use('/api', ranking)
app.use('/api', recommendations)
app.use('/api', auth) 
app.use('/api', events)  

// Seed opcional: node src/server.js --seed
if (process.argv.includes('--seed')) {
  console.log('Seed: validando db.json…')
  const db = readDB()
  if (!db.users?.length) {
    db.users = [{ id: 1, nome: 'Michael', nivel: 'iniciante', xp: 420, streakDias: 4 }]
  }
  writeDB(db)
  console.log('Seed concluído.')
  process.exit(0)
}

app.listen(PORT, () => {
  console.log(`Evolv.AI API rodando em http://localhost:${PORT}`)
})