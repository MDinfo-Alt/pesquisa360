# RF05 — Registro de Solução Digital

## 1. Identificação

**Código:** RF05  
**Nome:** Registro de Solução Digital  
**Prioridade:** Alta  
**Módulo:** Diagnóstico

## 2. Objetivo

Permitir que o pesquisador registre uma possível solução digital para uma ou mais dores identificadas durante o processo de pesquisa, documentando a ideia e sua relação com os problemas encontrados na empresa.

## 3. Descrição

Uma solução representa uma possível proposta de tecnologia elaborada pelo pesquisador a partir das dores e necessidades identificadas em uma empresa.

A solução deverá permitir documentar não apenas seu nome, mas também uma descrição de como ela poderia funcionar, quais problemas pretende resolver e observações relevantes para uma futura análise, desenvolvimento ou apresentação ao potencial cliente.

## 4. Dados da Solução

| Campo | Obrigatório | Descrição |
|---|---|---|
| Dor relacionada | Sim | Dor que originou a proposta |
| Nome da solução | Sim | Nome resumido da possível solução |
| Descrição | Sim | Descrição geral da solução |
| Funcionamento proposto | Não | Como a solução poderia funcionar |
| Benefício esperado | Não | Resultado esperado para a empresa |
| Complexidade estimada | Não | Complexidade técnica percebida |
| Observações | Não | Informações adicionais |
| Status | Sim | Estado atual da solução |

## 5. Regras de Negócio

### RN01 — Nome obrigatório

Toda solução deverá possuir um nome.

### RN02 — Descrição obrigatória

Toda solução deverá possuir uma descrição.

### RN03 — Relação com dores

Uma solução deverá estar relacionada a pelo menos uma dor identificada.

### RN04 — Múltiplas soluções

Uma dor poderá possuir várias soluções propostas.

### RN05 — Solução para múltiplas dores

Uma solução poderá estar relacionada a várias dores da mesma empresa.

### RN06 — Status inicial

Toda nova solução deverá ser criada com o status `IDEIA`.

### RN07 — Complexidade

A complexidade estimada será opcional e poderá ser classificada como:

- `BAIXA`
- `MEDIA`
- `ALTA`

### RN08 — Evolução da solução

O pesquisador poderá alterar o status da solução conforme ela evoluir no processo de análise e apresentação.

### RN09 — Histórico

Uma solução registrada não deverá ser excluída automaticamente quando uma dor relacionada for alterada ou desativada.

## 6. Fluxo Principal

1. O pesquisador acessa uma dor existente.
2. O pesquisador seleciona a opção "Adicionar solução".
3. O sistema apresenta o formulário de solução.
4. O pesquisador informa o nome e a descrição da solução.
5. O pesquisador pode descrever como a solução poderia funcionar.
6. O pesquisador pode informar os benefícios esperados.
7. O pesquisador pode estimar a complexidade técnica.
8. O pesquisador pode relacionar a solução a uma ou mais dores.
9. O pesquisador salva a solução.
10. O sistema registra a solução com o status `IDEIA`.
11. O sistema informa que a solução foi registrada com sucesso.

## 7. Fluxos Alternativos

### FA01 — Solução para múltiplas dores

1. O pesquisador inicia o cadastro de uma solução.
2. Seleciona uma ou mais dores relacionadas.
3. O sistema associa a solução às dores selecionadas.
4. A solução passa a representar uma possível resposta para todos os problemas relacionados.

### FA02 — Nova solução sem complexidade definida

1. O pesquisador cadastra uma solução.
2. Não informa a complexidade.
3. O sistema permite o cadastro normalmente.

### FA03 — Campos obrigatórios ausentes

1. O pesquisador tenta salvar a solução sem informar nome ou descrição.
2. O sistema informa os campos obrigatórios.
3. A solução não é cadastrada.

### FA04 — Cancelamento

1. O pesquisador inicia o cadastro de uma solução.
2. Seleciona "Cancelar".
3. O sistema solicita confirmação.
4. Caso confirme, nenhuma solução é criada.

## 8. Critérios de Aceitação

### CA01 — Cadastro de solução

**Dado que** existe pelo menos uma dor cadastrada  
**Quando** o pesquisador informar nome e descrição válidos  
**Então** o sistema deverá permitir o cadastro da solução.

### CA02 — Relação com dor

**Dado que** uma solução está sendo cadastrada  
**Quando** o pesquisador selecionar uma ou mais dores  
**Então** o sistema deverá relacionar a solução às dores selecionadas.

### CA03 — Múltiplas soluções

**Dado que** uma dor já possui uma solução registrada  
**Quando** o pesquisador cadastrar outra solução  
**Então** o sistema deverá permitir o novo registro.

### CA04 — Complexidade opcional

**Dado que** o pesquisador não possui uma estimativa de complexidade  
**Quando** cadastrar a solução  
**Então** o sistema deverá permitir o cadastro sem essa informação.

### CA05 — Status inicial

**Dado que** uma nova solução foi cadastrada  
**Então** seu status inicial deverá ser `IDEIA`.

### CA06 — Campos obrigatórios

**Dado que** o nome ou a descrição não foram informados  
**Quando** o pesquisador tentar salvar  
**Então** o sistema deverá impedir o cadastro.

### CA07 — Histórico

**Dado que** uma solução já foi registrada  
**Quando** uma dor relacionada sofrer alguma alteração  
**Então** o registro histórico da solução deverá permanecer preservado.
