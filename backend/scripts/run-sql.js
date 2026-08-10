// Executa arquivos .sql no banco configurado no .env (útil sem psql no PATH).
// Uso: node scripts/run-sql.js ../database/seed.sql
import { readFile } from 'node:fs/promises'
import pool from '../src/db/connection.js'

const arquivos = process.argv.slice(2)

if (arquivos.length === 0) {
    console.error('Informe ao menos um arquivo .sql')
    process.exit(1)
}

for (const arquivo of arquivos) {
    const sql = await readFile(arquivo, 'utf8')
    await pool.query(sql)
    console.log('OK:', arquivo)
}

await pool.end()
