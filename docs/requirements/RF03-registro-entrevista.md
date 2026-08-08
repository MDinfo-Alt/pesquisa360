# RF03 — Registro de Entrevista

## 1. Identificação

**Código:** RF03  
**Nome:** Registro de Entrevista  
**Prioridade:** Alta  
**Módulo:** Entrevistas

## 2. Objetivo

Permitir que o pesquisador registre as informações obtidas durante uma visita ou entrevista realizada com uma empresa, mantendo essas informações vinculadas à empresa pesquisada para posterior análise.

## 3. Descrição

Uma entrevista representa uma interação realizada pelo pesquisador com uma empresa potencial cliente.

O registro deverá permitir armazenar informações sobre a interação, incluindo a data da entrevista, o contato entrevistado, as respostas às perguntas da pesquisa e observações relevantes.

Uma empresa poderá possuir várias entrevistas ao longo do tempo.

O contato associado à entrevista será opcional.

## 4. Dados da Entrevista

| Campo | Obrigatório | Descrição |
|---|---|---|
| Empresa | Sim | Empresa relacionada à entrevista |
| Contato | Não | Pessoa entrevistada |
| Data da entrevista | Sim | Data em que a entrevista ocorreu |
| Respostas | Sim | Respostas fornecidas durante a pesquisa |
| Observações | Não | Informações relevantes que não se encaixam nas perguntas |

### Perguntas da pesquisa

As perguntas serão armazenadas de forma independente das entrevistas.

Cada pergunta poderá possuir:

- texto da pergunta;
- categoria;
- ordem de apresentação;
- tipo de resposta;
- status de ativa/inativa.

As respostas serão vinculadas à entrevista e à pergunta correspondente.
### Tipos de resposta

O sistema deverá permitir que uma pergunta seja configurada com diferentes tipos de resposta:

- `TEXTO`
- `NUMERO`
- `SIM_NAO`
- `SELECAO_UNICA`
- `MULTIPLA_SELECAO`

O tipo de resposta será definido na configuração da pergunta e determinará como ela será apresentada ao pesquisador durante a entrevista.
### RN01 — Empresa obrigatória

Toda entrevista deverá estar associada a uma empresa cadastrada.

### RN02 — Contato opcional

Uma entrevista poderá ser registrada sem um contato associado.

### RN03 — Múltiplas entrevistas

Uma empresa poderá possuir várias entrevistas.

### RN04 — Perguntas dinâmicas

As perguntas da pesquisa deverão ser armazenadas separadamente das entrevistas, permitindo adicionar, alterar ou desativar perguntas sem modificar a estrutura da entrevista.

### RN05 — Respostas vinculadas

Cada resposta deverá estar associada à entrevista e à pergunta correspondente.

### RN06 — Perguntas inativas

Perguntas desativadas não deverão aparecer em novas entrevistas, mas suas respostas históricas deverão permanecer armazenadas.
### RN07 — Tipo de resposta

Cada pergunta deverá possuir um tipo de resposta definido.

### RN08 — Validação da resposta

O sistema deverá validar a resposta de acordo com o tipo definido para a pergunta.

### RN09 — Histórico das respostas

As respostas registradas em entrevistas já realizadas não deverão ser alteradas automaticamente caso a pergunta seja posteriormente modificada.

## 6. Fluxo Principal

1. O pesquisador acessa o cadastro de uma empresa.
2. O pesquisador seleciona a opção "Nova entrevista".
3. O sistema apresenta o formulário da entrevista.
4. O pesquisador seleciona, opcionalmente, o contato entrevistado.
5. O sistema apresenta as perguntas ativas da pesquisa na ordem configurada.
6. O pesquisador responde às perguntas.
7. O sistema apresenta cada pergunta de acordo com seu tipo de resposta.
8. O pesquisador pode adicionar observações relevantes.
9. O pesquisador revisa as informações preenchidas.
10. O pesquisador confirma o registro.
11. O sistema salva a entrevista e suas respostas.
12. O sistema associa a entrevista à empresa selecionada.
13. O sistema informa que a entrevista foi registrada com sucesso.

## 7. Fluxos Alternativos

### FA01 — Entrevista sem contato

1. O pesquisador inicia uma nova entrevista.
2. Não seleciona nenhum contato.
3. O sistema permite continuar o preenchimento.
4. A entrevista é registrada apenas vinculada à empresa.

### FA02 — Resposta inválida

1. O pesquisador informa uma resposta incompatível com o tipo definido para a pergunta.
2. O sistema informa o erro.
3. O pesquisador deverá corrigir a resposta antes de finalizar a entrevista.

### FA03 — Cancelamento da entrevista

1. O pesquisador inicia uma entrevista.
2. Seleciona a opção "Cancelar".
3. O sistema solicita confirmação.
4. Caso confirme, a entrevista não será registrada.

### FA04 — Pergunta inativa

1. Uma pergunta foi marcada como inativa.
2. O pesquisador inicia uma nova entrevista.
3. A pergunta inativa não deverá ser apresentada.
4. Respostas de entrevistas anteriores permanecem armazenadas.

## 8. Critérios de Aceitação

### CA01 — Nova entrevista

**Dado que** existe uma empresa cadastrada  
**Quando** o pesquisador selecionar "Nova entrevista"  
**Então** o sistema deverá permitir iniciar uma nova entrevista.

### CA02 — Contato opcional

**Dado que** uma empresa não possui contato cadastrado  
**Quando** o pesquisador iniciar uma entrevista  
**Então** o sistema deverá permitir registrar a entrevista sem contato.

### CA03 — Perguntas ativas

**Dado que** existem perguntas ativas  
**Quando** o pesquisador iniciar uma entrevista  
**Então** o sistema deverá apresentar essas perguntas na ordem configurada.

### CA04 — Tipo de resposta

**Dado que** uma pergunta possui um tipo de resposta configurado  
**Quando** ela for apresentada  
**Então** o sistema deverá utilizar o componente correspondente ao tipo definido.

### CA05 — Respostas

**Dado que** o pesquisador respondeu às perguntas  
**Quando** confirmar a entrevista  
**Então** o sistema deverá armazenar as respostas vinculadas à entrevista e às respectivas perguntas.

### CA06 — Observações

**Dado que** o pesquisador possui informações adicionais  
**Quando** preencher as observações  
**Então** o sistema deverá armazená-las junto à entrevista.

### CA07 — Histórico

**Dado que** uma entrevista já foi registrada  
**Quando** uma pergunta for posteriormente alterada ou desativada  
**Então** as respostas da entrevista anterior deverão permanecer preservadas.

### CA08 — Cancelamento

**Dado que** o pesquisador iniciou uma entrevista  
**Quando** cancelar o processo e confirmar o cancelamento  
**Então** a entrevista não deverá ser registrada.
