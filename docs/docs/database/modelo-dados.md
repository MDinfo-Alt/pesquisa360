# Modelo de Dados — Pesquisa360

## 1. Objetivo

Este documento descreve o modelo de dados inicial do Pesquisa360.

O sistema será utilizado para organizar visitas e entrevistas realizadas com empresas, registrar as dores identificadas durante as pesquisas e documentar possíveis soluções digitais.

O modelo foi desenvolvido a partir dos requisitos funcionais definidos nos documentos de requisitos.

---

## 2. Entidades

O modelo possui as seguintes entidades:

### Empresas

Representa as empresas pesquisadas.

Principais informações:

- Nome
- Segmento
- Telefone/WhatsApp
- Endereço
- Bairro
- Cidade
- Site

### Segmentos

Representa os segmentos de atuação das empresas.

### Contatos

Representa as pessoas relacionadas a uma empresa.

### Entrevistas

Representa uma visita ou entrevista realizada com uma empresa.

### Categorias de Perguntas

Organiza as perguntas utilizadas nas pesquisas.

### Perguntas

Representa as perguntas que podem ser utilizadas nas entrevistas.

### Opções de Perguntas

Representa as opções disponíveis para perguntas do tipo seleção.

### Respostas

Registra as respostas fornecidas durante uma entrevista.

### Opções de Respostas

Relaciona uma resposta às opções selecionadas de uma pergunta.

### Categorias de Dores

Organiza as dores identificadas durante as entrevistas.

### Dores

Representa problemas ou dificuldades identificados em uma empresa.

### Soluções

Representa possíveis soluções digitais identificadas pelo pesquisador.

### Dores e Soluções

Relaciona dores às possíveis soluções.

### Empresas e Soluções

Relaciona empresas às soluções que podem ser consideradas para elas.

---

## 3. Relacionamentos

### Segmento → Empresa

Um segmento pode possuir várias empresas.

Uma empresa pertence a um segmento.

**Cardinalidade:** 1:N

---

### Empresa → Contato

Uma empresa pode possuir vários contatos.

Um contato pertence a uma empresa.

**Cardinalidade:** 1:N

---

### Empresa → Entrevista

Uma empresa pode possuir várias entrevistas.

Uma entrevista pertence a uma empresa.

**Cardinalidade:** 1:N

---

### Contato → Entrevista

Uma entrevista pode possuir um contato associado.

O contato é opcional.

**Cardinalidade:** 1:N

---

### Categoria de Pergunta → Pergunta

Uma categoria pode possuir várias perguntas.

Uma pergunta pertence a uma categoria.

**Cardinalidade:** 1:N

---

### Pergunta → Opção de Pergunta

Uma pergunta pode possuir várias opções.

Uma opção pertence a uma pergunta.

**Cardinalidade:** 1:N

---

### Entrevista → Resposta

Uma entrevista pode possuir várias respostas.

Uma resposta pertence a uma entrevista.

**Cardinalidade:** 1:N

---

### Pergunta → Resposta

Uma pergunta pode possuir respostas em várias entrevistas.

Cada resposta corresponde a uma pergunta.

**Cardinalidade:** 1:N

---

### Resposta → Opção de Resposta

Uma resposta pode possuir várias opções selecionadas.

**Cardinalidade:** 1:N

---

### Categoria de Dor → Dor

Uma categoria pode possuir várias dores.

Uma dor pertence a uma categoria.

**Cardinalidade:** 1:N

---

### Entrevista → Dor

Uma entrevista pode possuir várias dores.

Uma dor pertence a uma entrevista.

**Cardinalidade:** 1:N

---

### Dor ↔ Solução

Uma dor pode possuir várias soluções possíveis.

Uma solução pode resolver várias dores.

**Cardinalidade:** N:N

A relação é realizada através de `dores_solucoes`.

---

### Empresa ↔ Solução

Uma empresa pode possuir várias soluções consideradas.

Uma solução pode ser considerada para várias empresas.

**Cardinalidade:** N:N

A relação é realizada através de `empresas_solucoes`.

Essa relação também armazena informações específicas do relacionamento, como status e observações.

---

## 4. Regras importantes

- Uma empresa pode existir sem contatos.
- Uma empresa pode existir sem entrevistas.
- Uma entrevista deve estar vinculada a uma empresa.
- Uma entrevista pode ser registrada sem contato.
- Uma entrevista pode possuir várias respostas.
- Uma entrevista pode possuir várias dores.
- Uma pergunta pode ser utilizada em várias entrevistas.
- Perguntas inativas não devem aparecer em novas entrevistas.
- Respostas históricas devem permanecer preservadas.
- Uma dor pertence a uma entrevista.
- Uma solução pode estar relacionada a várias dores.
- Uma solução pode ser considerada para várias empresas.

---

## 5. Modelo

O modelo conceitual é representado pelo DER desenvolvido no dbdiagram.io.

O DBML utilizado para representar o modelo encontra-se no projeto e deverá ser mantido atualizado sempre que houver alterações estruturais no modelo de dados.

---

## 6. Observação

O modelo representa a primeira versão do banco de dados do Pesquisa360.

Novas entidades, campos ou relacionamentos somente deverão ser adicionados quando houver uma necessidade identificada nos requisitos do sistema.
