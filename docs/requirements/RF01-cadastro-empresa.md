# RF01 — Cadastro de Empresa

## 1. Identificação

**Código:** RF01  
**Nome:** Cadastro de Empresa  
**Prioridade:** Alta  
**Módulo:** Empresas

## 2. Objetivo

Permitir que o pesquisador cadastre e mantenha informações básicas de empresas que fazem parte do processo de prospecção e pesquisa.

## 3. Descrição

O sistema deverá permitir o cadastro de uma empresa potencial cliente, armazenando informações necessárias para sua identificação, contato e acompanhamento durante o processo de descoberta comercial.

O cadastro não terá como objetivo armazenar informações fiscais ou documentos da empresa, como CNPJ ou CPF.


## 4. Dados da Empresa

| Campo | Obrigatório | Descrição |
|---|---|---|
| Nome da empresa | Sim | Nome pelo qual a empresa é conhecida |
| Segmento | Sim | Área de atuação da empresa |
| Telefone/WhatsApp | Não | Principal meio de contato |
| Instagram | Não | Perfil da empresa |
| Site | Não | Endereço do site da empresa |
| Cidade | Não | Cidade onde a empresa está localizada |
| Bairro | Não | Bairro onde a empresa está localizada |
| Quantidade de funcionários | Não | Número aproximado de funcionários |
| Observações | Não | Informações gerais relevantes sobre a empresa |
| Status | Sim | Etapa atual da empresa no processo de prospecção |

### Status da empresa

Os status disponíveis serão:

- `PROSPECTADO`
- `ENTREVISTA_REALIZADA`
- `EM_ANALISE`
- `SOLUCAO_PREPARADA`
- `APRESENTACAO_REALIZADA`
- `CLIENTE`
- `SEM_INTERESSE`

## 5. Regras de Negócio

### RN01 — Nome obrigatório

Toda empresa cadastrada deverá possuir um nome.

### RN02 — Segmento obrigatório

Toda empresa cadastrada deverá possuir um segmento.

### RN03 — Segmentos flexíveis

O sistema deverá permitir selecionar um segmento previamente cadastrado ou cadastrar um novo segmento.

### RN04 — Documentos não são necessários

O cadastro de empresa não deverá exigir CPF, CNPJ ou outros documentos fiscais.

### RN05 — Status inicial

Toda nova empresa deverá ser cadastrada com o status `PROSPECTADO`.

### RN06 — Detecção de possíveis duplicidades

Ao cadastrar uma empresa, o sistema deverá verificar se existe
uma empresa com informações semelhantes.

Caso seja encontrada uma possível duplicidade, o sistema deverá
alertar o pesquisador e apresentar as opções de:

- acessar o cadastro existente; ou
- continuar o cadastro como uma nova empresa.

O sistema não deverá bloquear automaticamente o cadastro.

### RN07 — Empresas podem possuir múltiplos contatos

Uma empresa poderá possuir um ou mais contatos associados.

## 6. Fluxo Principal

1. O pesquisador acessa a opção de cadastro de empresa.
2. O sistema apresenta o formulário de cadastro.
3. O pesquisador informa os dados da empresa.
4. O pesquisador seleciona um segmento existente ou cadastra um novo segmento.
5. O sistema verifica possíveis empresas já cadastradas com informações semelhantes.
6. Não havendo conflito, o pesquisador confirma o cadastro.
7. O sistema registra a empresa com o status `PROSPECTADO`.
8. O sistema informa que a empresa foi cadastrada com sucesso.

## 7. Fluxos Alternativos

### FA01 — Possível empresa duplicada

1. Durante o cadastro, o sistema identifica uma possível empresa já cadastrada.
2. O sistema apresenta as informações da empresa encontrada.
3. O pesquisador poderá:
   - acessar o cadastro existente; ou
   - continuar o cadastro como uma nova empresa.
4. Caso escolha continuar, o sistema deverá registrar a nova empresa.

## 8. Critérios de Aceitação

### CA01 — Cadastro válido

**Dado que** o pesquisador está no cadastro de uma nova empresa  
**Quando** informar um nome e um segmento válidos  
**Então** o sistema deverá cadastrar a empresa com sucesso.

### CA02 — Nome obrigatório

**Dado que** o pesquisador está cadastrando uma empresa  
**Quando** tentar salvar sem informar o nome da empresa  
**Então** o sistema deverá informar que o nome é obrigatório  
**E** não deverá realizar o cadastro.

### CA03 — Segmento obrigatório

**Dado que** o pesquisador está cadastrando uma empresa  
**Quando** tentar salvar sem informar o segmento  
**Então** o sistema deverá informar que o segmento é obrigatório  
**E** não deverá realizar o cadastro.

### CA04 — Novo segmento

**Dado que** o segmento desejado não está cadastrado  
**Quando** o pesquisador solicitar o cadastro de um novo segmento  
**Então** o sistema deverá permitir o cadastro do novo segmento  
**E** disponibilizá-lo para utilização na empresa.

### CA05 — Possível duplicidade

**Dado que** já existe uma empresa com informações semelhantes  
**Quando** o pesquisador tentar cadastrar uma nova empresa  
**Então** o sistema deverá apresentar um alerta de possível duplicidade  
**E** deverá permitir acessar o cadastro existente ou continuar com o novo cadastro.

### CA06 — Status inicial

**Dado que** uma nova empresa foi cadastrada com sucesso  
**Então** o sistema deverá definir automaticamente seu status como `PROSPECTADO`.

### CA07 — Documentos

**Dado que** o pesquisador está cadastrando uma empresa  
**Então** o sistema não deverá exigir CPF, CNPJ ou outros documentos fiscais.
