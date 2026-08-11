import { api, mostrarAviso, opcoes } from './api.js'

const lista = document.querySelector('#lista')
const filtroEmpresa = document.querySelector('#filtro-empresa')

const data = (iso) => (iso ? new Date(iso).toLocaleDateString('pt-BR') : '—')

function link(href, texto) {
    const a = document.createElement('a')
    a.href = href
    a.textContent = texto

    return a
}

async function carregar() {
    const params = new URLSearchParams()

    if (filtroEmpresa.value) params.set('empresa_id', filtroEmpresa.value)

    const entrevistas = await api(`/entrevistas?${params}`)

    lista.innerHTML = ''

    if (entrevistas.length === 0) {
        const celula = lista.insertRow().insertCell()
        celula.colSpan = 5
        celula.className = 'vazio'
        celula.textContent =
            'Nenhuma entrevista registrada. Abra uma empresa para registrar a primeira.'
        return
    }

    for (const entrevista of entrevistas) {
        const linha = lista.insertRow()

        linha
            .insertCell()
            .append(link(`entrevista.html?id=${entrevista.id}`, data(entrevista.data_entrevista)))

        linha
            .insertCell()
            .append(link(`empresa.html?id=${entrevista.empresa_id}`, entrevista.empresa))

        linha.insertCell().textContent = entrevista.contato ?? '—'
        linha.insertCell().textContent = entrevista.total_dores
        linha.insertCell().textContent = entrevista.observacoes ?? '—'
    }
}

filtroEmpresa.addEventListener('change', carregar)

try {
    const empresas = await api('/empresas')

    opcoes(
        filtroEmpresa,
        empresas.map((e) => ({ valor: e.id, texto: e.nome })),
        'Todas as empresas'
    )

    await carregar()
} catch (erro) {
    mostrarAviso(`Não foi possível carregar as entrevistas: ${erro.message}`)
}
