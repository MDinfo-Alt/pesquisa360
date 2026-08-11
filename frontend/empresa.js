import {
    STATUS,
    api,
    dadosDoFormulario,
    mostrarAviso,
    opcoes,
    rotulo
} from './api.js'

const id = new URLSearchParams(location.search).get('id')

const nome = document.querySelector('#nome')
const dados = document.querySelector('#dados')
const selectStatus = document.querySelector('#status')
const formContato = document.querySelector('#form-contato')
const tabelaContatos = document.querySelector('#contatos')
const tabelaEntrevistas = document.querySelector('#entrevistas')

document.querySelector('#nova-entrevista').href = `nova-entrevista.html?empresa=${id}`

const data = (iso) => (iso ? new Date(iso).toLocaleDateString('pt-BR') : '—')

function preencher(campos) {
    dados.innerHTML = ''

    for (const [rotuloCampo, valor] of campos) {
        if (!valor) continue

        const dt = document.createElement('dt')
        dt.textContent = rotuloCampo

        const dd = document.createElement('dd')
        dd.textContent = valor

        dados.append(dt, dd)
    }
}

function linhas(tbody, itens, colunas, vazio) {
    tbody.innerHTML = ''

    if (itens.length === 0) {
        const celula = tbody.insertRow().insertCell()
        celula.colSpan = colunas.length
        celula.className = 'vazio'
        celula.textContent = vazio
        return
    }

    for (const item of itens) {
        const linha = tbody.insertRow()

        for (const coluna of colunas) {
            linha.insertCell().textContent = coluna(item) ?? '—'
        }
    }
}

async function carregar() {
    const empresa = await api(`/empresas/${id}`)

    document.title = `Pesquisa360 — ${empresa.nome}`
    nome.textContent = empresa.nome
    selectStatus.value = empresa.status

    preencher([
        ['Segmento', empresa.segmento],
        ['Cidade', empresa.cidade],
        ['Bairro', empresa.bairro],
        ['Endereço', empresa.endereco],
        ['WhatsApp', empresa.telefone_whatsapp],
        ['Site', empresa.site],
        ['Instagram', empresa.instagram],
        ['Funcionários', empresa.qtd_funcionarios],
        ['Observações', empresa.observacoes]
    ])

    linhas(
        tabelaContatos,
        empresa.contatos,
        [(c) => c.nome, (c) => c.cargo, (c) => c.telefone_whatsapp, (c) => c.email],
        'Nenhum contato cadastrado.'
    )

    tabelaEntrevistas.innerHTML = ''

    if (empresa.entrevistas.length === 0) {
        const celula = tabelaEntrevistas.insertRow().insertCell()
        celula.colSpan = 3
        celula.className = 'vazio'
        celula.textContent = 'Nenhuma entrevista registrada.'
        return
    }

    for (const entrevista of empresa.entrevistas) {
        const linha = tabelaEntrevistas.insertRow()

        const link = document.createElement('a')
        link.href = `entrevista.html?id=${entrevista.id}`
        link.textContent = data(entrevista.data_entrevista)
        linha.insertCell().append(link)

        linha.insertCell().textContent = entrevista.contato ?? '—'
        linha.insertCell().textContent = entrevista.observacoes ?? '—'
    }
}

selectStatus.addEventListener('change', async () => {
    try {
        await api(`/empresas/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status: selectStatus.value })
        })

        mostrarAviso('Status atualizado.', 'ok')
    } catch (erro) {
        mostrarAviso(erro.message)
        await carregar()
    }
})

formContato.addEventListener('submit', async (evento) => {
    evento.preventDefault()

    try {
        await api(`/empresas/${id}/contatos`, {
            method: 'POST',
            body: JSON.stringify(dadosDoFormulario(formContato))
        })

        formContato.reset()
        mostrarAviso('Contato adicionado.', 'ok')
        await carregar()
    } catch (erro) {
        mostrarAviso(erro.message)
    }
})

opcoes(
    selectStatus,
    STATUS.map((s) => ({ valor: s, texto: rotulo(s) }))
)

if (!id) {
    nome.textContent = 'Empresa não informada'
    mostrarAviso('Abra esta página a partir da lista de empresas.')
} else {
    try {
        await carregar()
    } catch (erro) {
        nome.textContent = 'Erro'
        mostrarAviso(erro.message)
    }
}
