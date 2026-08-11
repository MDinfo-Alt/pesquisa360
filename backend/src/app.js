import { fileURLToPath } from 'node:url'
import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import basicAuth from './auth.js'
import pool from './db/connection.js'
import empresasRoutes from './routes/empresas.routes.js'
import catalogosRoutes from './routes/catalogos.routes.js'
import contatosRoutes from './routes/contatos.routes.js'
import entrevistasRoutes from './routes/entrevistas.routes.js'
import doresRoutes from './routes/dores.routes.js'
import solucoesRoutes from './routes/solucoes.routes.js'

const app = Fastify({
    logger: true
})

// Antes de qualquer rota, inclusive os arquivos estáticos.
app.addHook('onRequest', basicAuth)

// Erros de integridade do Postgres viram 400/409 em vez de 500.
app.setErrorHandler((error, request, reply) => {
    if (error.code === '23503') {
        return reply.code(400).send({
            message: 'Referência inválida: o registro relacionado não existe.'
        })
    }

    if (error.code === '23505') {
        return reply.code(409).send({ message: 'Registro duplicado.' })
    }

    request.log.error(error)

    return reply.code(error.statusCode ?? 500).send({
        message: error.statusCode ? error.message : 'Erro interno do servidor'
    })
})

app.get('/health', async () => {
    return {
        status: 'ok',
        message: 'Pesquisa360 API funcionando!'
    }
})

app.get('/db-health', async () => {
    const result = await pool.query('SELECT NOW()')

    return {
        status: 'ok',
        database: 'conectado',
        time: result.rows[0].now
    }
})

// Interface: arquivos estáticos de ../frontend servidos na raiz.
await app.register(fastifyStatic, {
    root: fileURLToPath(new URL('../../frontend', import.meta.url))
})

await app.register(empresasRoutes)
await app.register(catalogosRoutes)
await app.register(contatosRoutes)
await app.register(entrevistasRoutes)
await app.register(doresRoutes)
await app.register(solucoesRoutes)

export default app
