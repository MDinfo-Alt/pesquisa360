import test from 'node:test'
import assert from 'node:assert/strict'
import { validarResposta } from '../src/routes/entrevistas.routes.js'

const pergunta = (tipo_resposta) => ({ tipo_resposta, texto: 'P' })

test('aceita respostas válidas por tipo', () => {
    assert.equal(validarResposta(pergunta('TEXTO'), { valor: 'oi' }), null)
    assert.equal(validarResposta(pergunta('NUMERO'), { valor: '12' }), null)
    assert.equal(validarResposta(pergunta('SIM_NAO'), { valor: 'sim' }), null)
    assert.equal(validarResposta(pergunta('SELECAO_UNICA'), { opcoes: [1] }), null)
    assert.equal(validarResposta(pergunta('MULTIPLA_SELECAO'), { opcoes: [1, 2] }), null)
})

test('recusa respostas incompatíveis com o tipo', () => {
    assert.ok(validarResposta(pergunta('TEXTO'), { valor: '  ' }))
    assert.ok(validarResposta(pergunta('NUMERO'), { valor: 'abc' }))
    assert.ok(validarResposta(pergunta('SIM_NAO'), { valor: 'talvez' }))
    assert.ok(validarResposta(pergunta('SELECAO_UNICA'), { opcoes: [1, 2] }))
    assert.ok(validarResposta(pergunta('MULTIPLA_SELECAO'), { opcoes: [] }))
})
