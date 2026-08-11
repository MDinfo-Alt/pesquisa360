import { timingSafeEqual } from 'node:crypto'

const USUARIO = process.env.AUTH_USER
const SENHA = process.env.AUTH_PASSWORD

// Sem credenciais o sistema ficaria aberto na internet, com dados de clientes
// e exclusão a um clique. Falhar aqui é melhor que subir desprotegido.
if (!USUARIO || !SENHA) {
    throw new Error(
        'Defina AUTH_USER e AUTH_PASSWORD no ambiente (veja .env.example).'
    )
}

const esperado = Buffer.from(`${USUARIO}:${SENHA}`)

// Comparação de tempo constante: com === o tempo de resposta vaza quantos
// caracteres da senha estão certos.
function credencialConfere(recebida) {
    const buffer = Buffer.from(recebida)

    return (
        buffer.length === esperado.length && timingSafeEqual(buffer, esperado)
    )
}

// /health fica aberto para o health check do host não precisar de credencial.
const LIVRES = new Set(['/health'])

export default async function basicAuth(request, reply) {
    if (LIVRES.has(request.url)) return

    const header = request.headers.authorization ?? ''
    const [esquema, credencial] = header.split(' ')

    if (esquema !== 'Basic' || !credencial) {
        return naoAutorizado(reply)
    }

    let decodificada

    try {
        decodificada = Buffer.from(credencial, 'base64').toString('utf8')
    } catch {
        return naoAutorizado(reply)
    }

    if (!credencialConfere(decodificada)) {
        return naoAutorizado(reply)
    }
}

function naoAutorizado(reply) {
    return reply
        .code(401)
        .header('WWW-Authenticate', 'Basic realm="Pesquisa360", charset="UTF-8"')
        .send({ message: 'Autenticação necessária.' })
}
