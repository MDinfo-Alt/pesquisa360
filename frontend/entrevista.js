import { api, dadosDoFormulario, mostrarAviso, opcoes } from './api.js'

const id = new URLSearchParams(location.search).get('id')

const titulo = document.querySelector('#titulo')
const voltar = document.querySelector('#voltar')
const dados = document.querySelector('#dados')
const listaRespostas = document.querySelector('#respostas')
const listaDores = document.querySelector('#dores')
const formDor = document.querySelector('#form-dor')

const data = (iso) => (iso ? new Date(iso).toLocaleDateString('pt-BR') : '—')

function definicoes(dl, itens) {
    dl.innerHTML = ''

    for (const [termo, valor] of itens) {
        if (!valor) continue

        const dt = document.createElement('dt')
        dt.textContent = termo

        const dd = document.createElement('dd')
        dd.textContent = valor

        dl.append(dt, dd)
    }
}

function renderizarDores(dores) {
    listaDores.innerHTML = ''

    if (dores.length === 0) {
        const vazio = document.createElement('p')
        vazio.className = 'vazio'
        vazio.textContent = 'Nenhuma dor registrada nesta entrevista.'
        listaDores.append(vazio)
        return
    }

    for (const dor of dores) {
        const cartao = document.createElement('article')
        cartao.className = 'dor'

        const cabecalho = document.createElement('h3')
        cabecalho.textContent = dor.titulo

        const etiqueta = document.createElement('span')
        etiqueta.className = 'badge'
        etiqueta.textContent = dor.categoria
        cabecalho.append(' ', etiqueta)

        const descricao = document.createElement('p')
        descricao.textContent = dor.descricao

        cartao.append(cabecalho, descricao)

        const detalhes = document.createElement('dl')
        definicoes(detalhes, [
            ['Frequência', dor.frequencia],
            ['Impacto', dor.impacto],
            ['Como resolvem hoje', dor.solucao_atual]
        ])

        if (detalhes.children.length > 0) {
            cartao.append(detalhes)
        }

        listaDores.append(cartao)
    }
}

async function carregar() {
    const entrevista = await api(`/entrevistas/${id}`)

    document.title = `Pesquisa360 — Entrevista: ${entrevista.empresa}`
    titulo.textContent = `Entrevista — ${entrevista.empresa}`
    voltar.href = `empresa.html?id=${entrevista.empresa_id}`

    definicoes(dados, [
        ['Data', data(entrevista.data_entrevista)],
        ['Entrevistado', entrevista.contato],
        ['Observações', entrevista.observacoes]
    ])

    definicoes(
        listaRespostas,
        entrevista.respostas.map((r) => [
            r.pergunta,
            r.opcoes.length > 0 ? r.opcoes.join(', ') : r.valor
        ])
    )

    if (listaRespostas.children.length === 0) {
        definicoes(listaRespostas, [['—', 'Nenhuma resposta registrada.']])
    }

    renderizarDores(entrevista.dores)
}

async function carregarCategorias(selecionar) {
    const categorias = await api('/categorias_dores')

    opcoes(
        formDor.categoria_id,
        categorias.map((c) => ({ valor: c.id, texto: c.nome })),
        'Selecione...'
    )

    if (selecionar) {
        formDor.categoria_id.value = selecionar
    }
}

formDor.addEventListener('submit', async (evento) => {
    evento.preventDefault()

    try {
        await api('/dores', {
            method: 'POST',
            body: JSON.stringify({
                ...dadosDoFormulario(formDor, ['categoria_id']),
                entrevista_id: Number(id)
            })
        })

        formDor.reset()
        mostrarAviso('Dor registrada.', 'ok')
        await carregar()
    } catch (erro) {
        mostrarAviso(erro.message)
    }
})

// RN05: categoria de dor pode ser criada na hora.
document.querySelector('#nova-categoria').addEventListener('click', async () => {
    const nome = prompt('Nome da nova categoria:')?.trim()

    if (!nome) return

    try {
        const categoria = await api('/categorias_dores', {
            method: 'POST',
            body: JSON.stringify({ nome })
        })

        await carregarCategorias(categoria.id)
    } catch (erro) {
        mostrarAviso(erro.message)
    }
})

if (!id) {
    titulo.textContent = 'Entrevista não informada'
    mostrarAviso('Abra esta página a partir da tela da empresa.')
} else {
    try {
        await carregar()
        await carregarCategorias()
    } catch (erro) {
        titulo.textContent = 'Erro'
        mostrarAviso(erro.message)
    }
}
