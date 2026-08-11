import {
    STATUS_SOLUCAO,
    api,
    dadosDoFormulario,
    mostrarAviso,
    opcoes,
    rotulo
} from './api.js'

const form = document.querySelector('#form-solucao')
const painelDores = document.querySelector('#dores')
const lista = document.querySelector('#lista')

// Dores agrupadas por empresa: sem isso a lista vira um monte de títulos soltos.
async function carregarDores() {
    const dores = await api('/dores')

    painelDores.innerHTML = ''

    if (dores.length === 0) {
        const vazio = document.createElement('p')
        vazio.className = 'vazio'
        vazio.textContent = 'Nenhuma dor registrada ainda. Registre dores nas entrevistas.'
        painelDores.append(vazio)
        return
    }

    let empresaAtual = null

    for (const dor of dores) {
        if (dor.empresa !== empresaAtual) {
            empresaAtual = dor.empresa

            const cabecalho = document.createElement('p')
            cabecalho.className = 'grupo'
            cabecalho.textContent = empresaAtual
            painelDores.append(cabecalho)
        }

        const item = document.createElement('label')
        item.className = 'opcao'

        const input = document.createElement('input')
        input.type = 'checkbox'
        input.name = 'dores'
        input.value = dor.id

        item.append(input, document.createTextNode(` ${dor.titulo} (${dor.categoria})`))
        painelDores.append(item)
    }
}

function cartao(solucao) {
    const artigo = document.createElement('article')
    artigo.className = 'dor'

    const titulo = document.createElement('h3')
    titulo.textContent = solucao.nome

    if (solucao.complexidade) {
        const etiqueta = document.createElement('span')
        etiqueta.className = 'badge'
        etiqueta.textContent = `complexidade ${rotulo(solucao.complexidade)}`
        titulo.append(' ', etiqueta)
    }

    const descricao = document.createElement('p')
    descricao.textContent = solucao.descricao

    const rodape = document.createElement('div')
    rodape.className = 'linha'

    const select = document.createElement('select')
    opcoes(select, STATUS_SOLUCAO.map((s) => ({ valor: s, texto: rotulo(s) })))
    select.value = solucao.status

    select.addEventListener('change', async () => {
        try {
            await api(`/solucoes/${solucao.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ status: select.value })
            })

            mostrarAviso(`Status de "${solucao.nome}" atualizado.`, 'ok')
        } catch (erro) {
            select.value = solucao.status
            mostrarAviso(erro.message)
        }
    })

    const resolve = document.createElement('p')
    resolve.className = 'resolve'
    resolve.textContent = `Resolve: ${solucao.dores.map((d) => d.titulo).join(' · ')}`

    rodape.append(select)
    artigo.append(titulo, descricao, resolve, rodape)

    return artigo
}

async function carregarSolucoes() {
    const solucoes = await api('/solucoes')

    lista.innerHTML = ''

    if (solucoes.length === 0) {
        const vazio = document.createElement('p')
        vazio.className = 'vazio'
        vazio.textContent = 'Nenhuma solução registrada.'
        lista.append(vazio)
        return
    }

    lista.append(...solucoes.map(cartao))
}

form.addEventListener('submit', async (evento) => {
    evento.preventDefault()

    const escolhidas = new FormData(form).getAll('dores').map(Number)

    // RN03: a solução nasce ligada a pelo menos uma dor.
    if (escolhidas.length === 0) {
        return mostrarAviso('Selecione ao menos uma dor que esta solução resolve.')
    }

    const { dores, ...campos } = dadosDoFormulario(form)

    try {
        await api('/solucoes', {
            method: 'POST',
            body: JSON.stringify({ ...campos, dores: escolhidas })
        })

        form.reset()
        mostrarAviso('Solução cadastrada.', 'ok')
        await carregarSolucoes()
    } catch (erro) {
        mostrarAviso(erro.message)
    }
})

try {
    await carregarDores()
    await carregarSolucoes()
} catch (erro) {
    mostrarAviso(`Não foi possível carregar os dados: ${erro.message}`)
}
