import { api, mostrarAviso, opcoes } from './api.js'

const empresaId = new URLSearchParams(location.search).get('empresa')

const form = document.querySelector('#form-entrevista')
const titulo = document.querySelector('#titulo')
const voltar = document.querySelector('#voltar')
const container = document.querySelector('#perguntas')

// Cada pergunta vira um controle diferente conforme tipo_resposta (RN08).
function campoDaPergunta(pergunta) {
    const nome = `p${pergunta.id}`

    if (pergunta.tipo_resposta === 'SELECAO_UNICA' || pergunta.tipo_resposta === 'MULTIPLA_SELECAO') {
        const grupo = document.createElement('div')
        grupo.className = 'opcoes'

        for (const opcao of pergunta.opcoes) {
            const item = document.createElement('label')
            item.className = 'opcao'

            const input = document.createElement('input')
            input.type = pergunta.tipo_resposta === 'SELECAO_UNICA' ? 'radio' : 'checkbox'
            input.name = nome
            input.value = opcao.id

            item.append(input, document.createTextNode(` ${opcao.texto}`))
            grupo.append(item)
        }

        return grupo
    }

    if (pergunta.tipo_resposta === 'SIM_NAO') {
        const select = document.createElement('select')
        select.name = nome

        opcoes(
            select,
            [
                { valor: 'SIM', texto: 'Sim' },
                { valor: 'NAO', texto: 'Não' }
            ],
            'Não respondeu'
        )

        return select
    }

    if (pergunta.tipo_resposta === 'NUMERO') {
        const input = document.createElement('input')
        input.type = 'number'
        input.name = nome

        return input
    }

    const textarea = document.createElement('textarea')
    textarea.name = nome
    textarea.rows = 2

    return textarea
}

function renderizar(perguntas) {
    let categoriaAtual = null
    let secao = null

    for (const pergunta of perguntas) {
        // Perguntas vêm ordenadas; troca de categoria abre uma nova seção.
        if (pergunta.categoria !== categoriaAtual) {
            categoriaAtual = pergunta.categoria

            secao = document.createElement('section')

            const h2 = document.createElement('h2')
            h2.textContent = categoriaAtual
            secao.append(h2)

            container.append(secao)
        }

        const label = document.createElement('label')
        label.className = 'pergunta'
        label.append(document.createTextNode(pergunta.texto), campoDaPergunta(pergunta))

        secao.append(label)
    }
}

// Só envia o que foi respondido — o backend valida cada resposta enviada.
function coletarRespostas(perguntas) {
    const dados = new FormData(form)

    return perguntas.flatMap((pergunta) => {
        const nome = `p${pergunta.id}`

        if (pergunta.tipo_resposta === 'SELECAO_UNICA' || pergunta.tipo_resposta === 'MULTIPLA_SELECAO') {
            const escolhidas = dados.getAll(nome).map(Number)

            return escolhidas.length > 0
                ? [{ pergunta_id: pergunta.id, opcoes: escolhidas }]
                : []
        }

        const valor = dados.get(nome)?.trim()

        return valor ? [{ pergunta_id: pergunta.id, valor }] : []
    })
}

const perguntas = []

async function carregar() {
    const [empresa, lista] = await Promise.all([
        api(`/empresas/${empresaId}`),
        api('/perguntas')
    ])

    document.title = `Pesquisa360 — Entrevista: ${empresa.nome}`
    titulo.textContent = `Nova entrevista — ${empresa.nome}`
    voltar.href = `empresa.html?id=${empresaId}`

    opcoes(
        form.contato_id,
        empresa.contatos.map((c) => ({
            valor: c.id,
            texto: c.cargo ? `${c.nome} (${c.cargo})` : c.nome
        })),
        empresa.contatos.length > 0 ? 'Não informado' : 'Nenhum contato cadastrado'
    )

    perguntas.push(...lista)
    renderizar(lista)

    form.data_entrevista.valueAsDate = new Date()
}

form.addEventListener('submit', async (evento) => {
    evento.preventDefault()

    const corpo = {
        empresa_id: Number(empresaId),
        data_entrevista: form.data_entrevista.value,
        respostas: coletarRespostas(perguntas)
    }

    if (form.contato_id.value) corpo.contato_id = Number(form.contato_id.value)
    if (form.observacoes.value.trim()) corpo.observacoes = form.observacoes.value.trim()

    try {
        const entrevista = await api('/entrevistas', {
            method: 'POST',
            body: JSON.stringify(corpo)
        })

        location.href = `entrevista.html?id=${entrevista.id}`
    } catch (erro) {
        mostrarAviso(erro.message)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
})

if (!empresaId) {
    titulo.textContent = 'Empresa não informada'
    mostrarAviso('Abra esta página a partir da tela da empresa.')
} else {
    try {
        await carregar()
    } catch (erro) {
        mostrarAviso(erro.message)
    }
}
