# RF04 — Registro de Dores

## 1. Identificação

**Código:** RF04  
**Nome:** Registro de Dores  
**Prioridade:** Alta  
**Módulo:** Diagnóstico

## 2. Objetivo

Permitir que o pesquisador registre e organize os problemas, dificuldades e necessidades identificados durante ou após uma entrevista, possibilitando posteriormente analisar essas dores e utilizá-las como base para definição de soluções digitais.

## 3. Descrição

Uma dor representa um problema ou dificuldade relevante identificado em uma empresa durante o processo de pesquisa.

A dor deverá estar vinculada a uma entrevista, mantendo o contexto em que foi identificada.

O pesquisador poderá registrar uma ou várias dores durante uma entrevista ou posteriormente, acessando o registro da entrevista.

As dores deverão possuir informações que permitam avaliar sua frequência, impacto e forma atual de resolução.

## 4. Dados da Dor

| Campo | Obrigatório | Descrição |
|---|---|---|
| Entrevista | Sim | Entrevista na qual a dor foi identificada |
| Título | Sim | Nome resumido da dor |
| Descrição | Sim | Detalhamento do problema identificado |
| Categoria | Sim | Área relacionada ao problema |
| Frequência | Não | Frequência com que o problema ocorre |
| Impacto | Não | Impacto percebido no negócio |
| Solução atual | Não | Como a empresa resolve o problema atualmente |
| Observações | Não | Informações adicionais relevantes |

## 5. Regras de Negócio

### RN01 — Entrevista obrigatória

Toda dor deverá estar vinculada a uma entrevista existente.

### RN02 — Título obrigatório

Toda dor deverá possuir um título.

### RN03 — Descrição obrigatória

Toda dor deverá possuir uma descrição que explique o problema identificado.

### RN04 — Categoria obrigatória

Toda dor deverá possuir uma categoria.

### RN05 — Categorias flexíveis

O sistema deverá permitir selecionar uma categoria de dor existente ou cadastrar uma nova categoria.

### RN06 — Múltiplas dores

Uma entrevista poderá possuir várias dores identificadas.

### RN07 — Registro durante ou após a entrevista

O pesquisador poderá registrar uma dor durante a realização da entrevista ou posteriormente, acessando o registro da entrevista.

### RN08 — Histórico

Uma dor registrada deverá permanecer associada à entrevista na qual foi identificada.

### RN09 — Frequência e impacto

Frequência e impacto serão informações opcionais para a V1.

### RN10 — Solução atual

O pesquisador poderá registrar como a empresa resolve atualmente o problema identificado.

## 6. Fluxo Principal

1. O pesquisador acessa uma entrevista existente ou está realizando uma nova entrevista.
2. O pesquisador seleciona a opção "Adicionar dor".
3. O sistema apresenta o formulário de registro da dor.
4. O pesquisador informa o título e a descrição do problema.
5. O pesquisador seleciona uma categoria existente ou cadastra uma nova categoria.
6. O pesquisador pode informar a frequência, o impacto e como a empresa resolve atualmente o problema.
7. O pesquisador salva a dor.
8. O sistema associa a dor à entrevista.
9. O sistema informa que a dor foi registrada com sucesso.

## 7. Fluxos Alternativos

### FA01 — Cadastro posterior

1. O pesquisador acessa uma entrevista já registrada.
2. Seleciona "Adicionar dor".
3. Registra uma nova dor.
4. O sistema associa a dor à entrevista existente.

### FA02 — Nova categoria

1. O pesquisador não encontra uma categoria adequada.
2. Seleciona a opção para cadastrar uma nova categoria.
3. Informa o nome da categoria.
4. O sistema cadastra a categoria.
5. A nova categoria fica disponível para a dor.

### FA03 — Dados obrigatórios ausentes

1. O pesquisador tenta salvar uma dor sem título, descrição ou categoria.
2. O sistema informa quais campos obrigatórios precisam ser preenchidos.
3. A dor não é registrada.

## 8. Critérios de Aceitação

### CA01 — Registrar dor

**Dado que** existe uma entrevista cadastrada  
**Quando** o pesquisador informar título, descrição e categoria válidos  
**Então** o sistema deverá registrar a dor associada à entrevista.

### CA02 — Múltiplas dores

**Dado que** uma entrevista já possui uma dor registrada  
**Quando** o pesquisador cadastrar outra dor  
**Então** o sistema deverá permitir o novo registro.

### CA03 — Cadastro posterior

**Dado que** uma entrevista já foi finalizada  
**Quando** o pesquisador acessar essa entrevista  
**Então** deverá ser possível adicionar uma nova dor.

### CA04 — Categoria

**Dado que** o pesquisador não encontra uma categoria adequada  
**Quando** cadastrar uma nova categoria  
**Então** a categoria deverá ficar disponível para utilização.

### CA05 — Campos obrigatórios

**Dado que** o pesquisador não informou título, descrição ou categoria  
**Quando** tentar salvar a dor  
**Então** o sistema deverá impedir o cadastro e informar os campos obrigatórios.

### CA06 — Informações opcionais

**Dado que** título, descrição e categoria foram informados  
**Quando** frequência, impacto ou solução atual não forem preenchidos  
**Então** o sistema deverá permitir o cadastro.

### CA07 — Associação

**Dado que** uma dor foi cadastrada  
**Então** ela deverá permanecer associada à entrevista na qual foi identificada.
