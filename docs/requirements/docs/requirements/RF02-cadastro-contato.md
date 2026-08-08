# RF02 — Cadastro de Contato

## 1. Identificação

**Código:** RF02  
**Nome:** Cadastro de Contato  
**Prioridade:** Alta  
**Módulo:** Contatos

## 2. Objetivo

## 3. Descrição

## 4. Dados do Contato

| Campo | Obrigatório | Descrição |
|---|---|---|
| Nome | Sim | Nome da pessoa de contato |
| Cargo/Função | Não | Função exercida na empresa |
| Telefone/WhatsApp | Não | Principal meio de contato |
| E-mail | Não | E-mail do contato |
| Observações | Não | Informações adicionais relevantes |

## 5. Regras de Negócio

### RN01 — Empresa obrigatória

Todo contato deverá estar associado a uma empresa cadastrada.

### RN02 — Nome obrigatório

Todo contato deverá possuir um nome.

### RN03 — Dados de contato opcionais

Cargo, telefone/WhatsApp, e-mail e observações serão opcionais.

### RN04 — Múltiplos contatos

Uma empresa poderá possuir vários contatos.

### RN05 — Cadastro independente

O cadastro da empresa não dependerá da existência de um contato.

### RN06 — Alteração

O pesquisador poderá editar ou atualizar os dados de um contato posteriormente.

## 6. Fluxo Principal

1. O pesquisador acessa o cadastro de uma empresa.
2. O sistema apresenta as informações da empresa.
3. O pesquisador seleciona a opção "Adicionar contato".
4. O sistema apresenta o formulário de cadastro do contato.
5. O pesquisador informa o nome e, opcionalmente, os demais dados.
6. O pesquisador confirma o cadastro.
7. O sistema associa o contato à empresa selecionada.
8. O sistema informa que o contato foi cadastrado com sucesso.

## 7. Fluxos Alternativos

### FA01 — Nome não informado

1. O pesquisador tenta salvar o contato sem informar o nome.
2. O sistema informa que o nome é obrigatório.
3. O contato não é cadastrado.
4. O pesquisador pode corrigir o formulário e tentar novamente.

### FA02 — Cancelamento

1. O pesquisador seleciona a opção "Cancelar".
2. O sistema retorna para o cadastro da empresa.
3. Nenhum contato é criado.

## 8. Critérios de Aceitação

### CA01 — Cadastro válido

**Dado que** existe uma empresa cadastrada  
**Quando** o pesquisador informar um nome válido para o contato  
**Então** o sistema deverá cadastrar o contato associado à empresa.

### CA02 — Nome obrigatório

**Dado que** o pesquisador está cadastrando um contato  
**Quando** tentar salvar sem informar o nome  
**Então** o sistema deverá informar que o nome é obrigatório  
**E** não deverá criar o contato.

### CA03 — Dados opcionais

**Dado que** o pesquisador informou apenas o nome  
**Quando** salvar o contato  
**Então** o sistema deverá permitir o cadastro sem exigir cargo, telefone, e-mail ou observações.

### CA04 — Múltiplos contatos

**Dado que** uma empresa já possui um contato  
**Quando** o pesquisador cadastrar outro contato  
**Então** o sistema deverá permitir o novo cadastro.

### CA05 — Associação com empresa

**Dado que** o pesquisador está visualizando uma empresa  
**Quando** cadastrar um contato  
**Então** o contato deverá ficar associado àquela empresa.

### CA06 — Cancelamento

**Dado que** o pesquisador iniciou o cadastro  
**Quando** selecionar "Cancelar"  
**Então** o sistema não deverá criar o contato.
