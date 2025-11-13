import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbPath = path.join(__dirname, '..', 'db.json')

export function readDB() {
  const raw = fs.readFileSync(dbPath, 'utf-8')
  return JSON.parse(raw)
}

export function writeDB(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))
}