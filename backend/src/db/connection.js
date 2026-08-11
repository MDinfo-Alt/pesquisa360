import 'dotenv/config'
import pg from 'pg'

const { Pool } = pg

// Postgres gerenciado (Neon, Render, Railway) entrega uma DATABASE_URL única e
// exige SSL. Sem ela, cai nas variáveis separadas do desenvolvimento local.
//
// O certificado é verificado por padrão. Hosts com certificado autoassinado
// (Postgres interno do Render, por exemplo) precisam de DB_SSL_SEM_VERIFICAR,
// que aceita qualquer certificado e abre espaço para interceptação — use só
// quando o banco e a aplicação estiverem na mesma rede privada do host.
const pool = process.env.DATABASE_URL
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl:
            process.env.DB_SSL_SEM_VERIFICAR === 'true'
                ? { rejectUnauthorized: false }
                : true
    })
    : new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    })

export default pool
