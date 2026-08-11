import {
    STATUS,
    api,
    badgeStatus,
    dadosDoFormulario,
    mostrarAviso,
    opcoes,
    rotulo
} from './api.js'

const form = document.querySelector('#form-empresa')
const lista = document.querySelector('#lista')
const busca = document.querySelector('#busca')
const filtroStatus = document.querySelector('#filtro-status')
const filtroSegmento = document.querySelector('#filtro-segmento')

async function carregarSegmentos(selecionar) {
    const segmentos = await api('/segmentos')
    const itens = segmentos.map((s) => ({ valor: s.id, texto: s.nome }))

    opcoes(form.segmento_id, itens, 'Selecione...')
    opcoes(filtroSegmento, itens, 'Todos os segmentos')

    if (selecionar) {
        form.segmento_id.value = selecionar
    }
}

async function carregarEmpresas() {
    const params = new URLSearchParams()

    if (busca.value.trim()) params.set('busca', busca.value.trim())
    if (filtroStatus.value) params.set('status', filtroStatus.value)
    if (filtroSegmento.value) params.set('segmento_id', filtroSegmento.value)

    const empresas = await api(`/empresas?${params}`)

    lista.innerHTML = ''

    if (empresas.length === 0) {
        const vazio = lista.insertRow()
        const celula = vazio.insertCell()
        celula.colSpan = 6
        celula.className = 'vazio'
        celula.textContent = 'Nenhuma empresa encontrada.'
        return
    }

    for (const empresa of empresas) {
        const linha = lista.insertRow()

        const link = document.createElement('a')
        link.href = `empresa.html?id=${empresa.id}`
        link.textContent = empresa.nome
        linha.insertCell().append(link)

        for (const valor of [
            empresa.segmento,
            empresa.cidade,
            empresa.telefone_whatsapp
        ]) {
            linha.insertCell().textContent = valor ?? '—'
        }

        linha.insertCell().append(badgeStatus(empresa.status))

        const excluir = document.createElement('button')
        excluir.className = 'excluir'
        excluir.type = 'button'
        excluir.title = `Excluir ${empresa.nome}`
        excluir.textContent = '✕'
        excluir.addEventListener('click', () => remover(empresa))

        const acoes = linha.insertCell()
        acoes.className = 'acoes'
        acoes.append(excluir)
    }
}

async function cadastrar(permitirDuplicado) {
    const dados = dadosDoFormulario(form, ['segmento_id', 'qtd_funcionarios'])

    if (permitirDuplicado) {
        dados.permitir_duplicado = true
    }

    try {
        await api('/empresas', { method: 'POST', body: JSON.stringify(dados) })

        form.reset()
        mostrarAviso('Empresa cadastrada.', 'ok')
        await carregarEmpresas()
    } catch (erro) {
        // RN06: duplicidade alerta, não bloqueia — confirma e reenvia.
        if (erro.status === 409 && !permitirDuplicado) {
            const existente = erro.corpo.empresa

            if (
                confirm(
                    `Já existe "${existente?.nome}" em ${existente?.cidade ?? 'cidade não informada'}.\nCadastrar mesmo assim?`
                )
            ) {
                return cadastrar(true)
            }

            return mostrarAviso('Cadastro cancelado.')
        }

        mostrarAviso(erro.message)
    }
}

async function remover(empresa) {
    if (!confirm(`Excluir "${empresa.nome}"? Isso não pode ser desfeito.`)) return

    try {
        await api(`/empresas/${empresa.id}`, { method: 'DELETE' })

        mostrarAviso(`"${empresa.nome}" excluída.`, 'ok')
        await carregarEmpresas()
    } catch (erro) {
        mostrarAviso(erro.message)
    }
}

form.addEventListener('submit', (evento) => {
    evento.preventDefault()
    cadastrar(false)
})

// RN03: pode cadastrar um segmento novo na hora, sem sair da tela.
document.querySelector('#novo-segmento').addEventListener('click', async () => {
    const nome = prompt('Nome do novo segmento:')?.trim()

    if (!nome) return

    try {
        const segmento = await api('/segmentos', {
            method: 'POST',
            body: JSON.stringify({ nome })
        })

        await carregarSegmentos(segmento.id)
    } catch (erro) {
        mostrarAviso(erro.message)
    }
})

let debounce
busca.addEventListener('input', () => {
    clearTimeout(debounce)
    debounce = setTimeout(carregarEmpresas, 300)
})

filtroStatus.addEventListener('change', carregarEmpresas)
filtroSegmento.addEventListener('change', carregarEmpresas)

opcoes(
    filtroStatus,
    STATUS.map((s) => ({ valor: s, texto: rotulo(s) })),
    'Todos os status'
)

try {
    await carregarSegmentos()
    await carregarEmpresas()
} catch (erro) {
    mostrarAviso(`Não foi possível carregar os dados: ${erro.message}`)
}
