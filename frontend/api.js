export const STATUS = [
    'PROSPECTADO',
    'ENTREVISTA_REALIZADA',
    'EM_ANALISE',
    'SOLUCAO_PREPARADA',
    'APRESENTACAO_REALIZADA',
    'CLIENTE',
    'SEM_INTERESSE'
]

export const STATUS_SOLUCAO = ['IDEIA', 'EM_ANALISE', 'PREPARADA', 'APRESENTADA', 'DESCARTADA']

export const rotulo = (status) => status.replaceAll('_', ' ').toLowerCase()

export async function api(rota, opcoes) {
    const resposta = await fetch(rota, {
        ...opcoes,
        headers: opcoes?.body ? { 'Content-Type': 'application/json' } : undefined
    })

    // DELETE responde 204 sem corpo — json() estouraria.
    const corpo = resposta.status === 204 ? null : await resposta.json()

    if (!resposta.ok) {
        throw Object.assign(new Error(corpo?.message ?? 'Erro na requisição'), {
            status: resposta.status,
            corpo
        })
    }

    return corpo
}

export function mostrarAviso(texto, tipo = 'erro') {
    const aviso = document.querySelector('#aviso')

    aviso.textContent = texto
    aviso.className = tipo
    aviso.hidden = !texto
}

export function opcoes(select, itens, placeholder) {
    select.innerHTML = ''

    if (placeholder) {
        select.append(new Option(placeholder, ''))
    }

    for (const { valor, texto } of itens) {
        select.append(new Option(texto, valor))
    }
}

export function badgeStatus(status) {
    const badge = document.createElement('span')

    badge.className = 'badge'
    badge.dataset.status = status
    badge.textContent = rotulo(status)

    return badge
}

// Monta o body só com os campos preenchidos: o schema rejeita string vazia
// onde espera integer.
export function dadosDoFormulario(form, numericos = []) {
    const dados = {}

    for (const [campo, valor] of new FormData(form)) {
        if (valor === '') continue

        dados[campo] = numericos.includes(campo) ? Number(valor) : valor
    }

    return dados
}
