# Pesquisa360

## Sobre o projeto

## Problema
O processo de visita e descoberta de potenciais clientes pode gerar muitas informações diferentes, como dados da empresa, entrevistados, respostas, problemas identificados, necessidades e oportunidades.

Sem uma ferramenta centralizada, essas informações podem ficar dispersas em anotações, documentos ou planilhas, dificultando o acompanhamento das visitas e a análise dos padrões encontrados.

O Pesquisa360 surge para organizar e gerenciar esse processo de descoberta comercial, centralizando as informações coletadas durante as visitas e permitindo que elas sejam consultadas e analisadas posteriormente.

## Objetivo
O objetivo do Pesquisa360 é permitir o cadastro e gerenciamento de potenciais clientes, registrando informações sobre seus negócios, processos, dores e necessidades identificadas durante as visitas.

A partir das informações coletadas, o sistema deverá auxiliar na organização e avaliação das oportunidades de soluções digitais que possam atender aos problemas encontrados.

O sistema deverá permitir que o pesquisador consulte posteriormente as informações coletadas e utilize esses dados como base para definir quais soluções de tecnologia podem ser desenvolvidas ou oferecidas para cada empresa.
## Público-alvo

## Escopo inicial (MVP)
A primeira versão do Pesquisa360 terá como objetivo apoiar o processo de descoberta e diagnóstico de potenciais clientes.

O MVP deverá permitir:

1. Cadastrar empresas;
2. Registrar entrevistas realizadas com empresas;
3. Registrar dores, problemas e necessidades identificadas;
4. Registrar uma possível solução digital baseada na análise da pesquisa;
5. Consultar posteriormente as empresas, entrevistas, dores e soluções registradas.

O sistema será inicialmente utilizado pelo próprio pesquisador como ferramenta interna para organizar as visitas e apoiar a identificação de oportunidades de desenvolvimento de soluções digitais.
## Funcionalidades previstas

- Cadastro de empresas, com segmentos flexíveis e alerta de duplicidade (RF01)
- Cadastro de contatos por empresa (RF02)
- Registro de entrevistas com respostas às perguntas da pesquisa (RF03)
- Registro de dores por entrevista (RF04)
- Registro de soluções digitais ligadas às dores (RF05)

## Tecnologias

- Node.js + Fastify (API REST)
- PostgreSQL (`pg`)
- Interface em HTML, CSS e JavaScript puro, servida pelo próprio Fastify (`@fastify/static`)

## Como executar

Pré-requisitos: Node.js 20+ e PostgreSQL.

```bash
cd backend
npm install
cp .env.example .env      # ajuste usuário/senha do Postgres
```

Crie o banco `pesquisa360` no Postgres e então:

```bash
npm run db:schema   # cria as tabelas (banco novo)
npm run db:ajustes  # só se o banco foi criado antes destas colunas
npm run db:seed     # segmentos, categorias e perguntas iniciais
npm run dev         # http://localhost:3333
npm test
```

A interface abre em `http://localhost:3333`. Verificação rápida da API: `GET http://localhost:3333/db-health`.

## Telas

| Tela | Arquivo | O que faz |
|---|---|---|
| Empresas | `index.html` | Lista com busca e filtros, cadastro e exclusão |
| Empresa | `empresa.html?id=` | Dados, troca de status, contatos e entrevistas |
| Nova entrevista | `nova-entrevista.html?empresa=` | Questionário montado a partir de `/perguntas` |
| Entrevista | `entrevista.html?id=` | Respostas registradas e cadastro de dores |
| Soluções | `solucoes.html` | Cadastro ligado às dores e acompanhamento do status |

## API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/empresas?busca=&status=&segmento_id=` | Lista empresas |
| GET | `/empresas/:id` | Empresa com contatos e entrevistas |
| POST | `/empresas` | Cadastra (409 em possível duplicidade; reenvie com `permitir_duplicado: true`) |
| PATCH | `/empresas/:id` | Atualiza campos, inclusive o status |
| GET/POST | `/empresas/:id/contatos` | Contatos da empresa |
| PATCH | `/contatos/:id` | Atualiza contato |
| GET | `/perguntas` | Perguntas ativas, na ordem, com opções |
| GET | `/empresas/:id/entrevistas` | Entrevistas da empresa |
| GET | `/entrevistas/:id` | Entrevista com respostas e dores |
| POST | `/entrevistas` | Registra entrevista + respostas (transação) |
| GET | `/dores?empresa_id=&entrevista_id=&categoria_id=` | Lista dores |
| GET | `/dores/:id` | Dor com soluções relacionadas |
| POST | `/dores` | Registra dor |
| GET/POST | `/solucoes` | Soluções e suas dores |
| PATCH | `/solucoes/:id` | Atualiza status da solução |
| DELETE | `/empresas/:id` | Remove empresa (409 se houver contatos ou entrevistas) |
| GET/POST | `/segmentos`, `/categorias_dores`, `/categorias_perguntas` | Listas de apoio |

Exemplo de entrevista:

```json
{
  "empresa_id": 1,
  "contato_id": 1,
  "data_entrevista": "2026-08-09",
  "observacoes": "visita presencial",
  "respostas": [
    { "pergunta_id": 1, "valor": "Anotando em caderno" },
    { "pergunta_id": 5, "valor": "NAO" },
    { "pergunta_id": 6, "opcoes": [1, 3] }
  ]
}
```

## Status do projeto

MVP funcional de ponta a ponta: backend e interface cobrem RF01 a RF05 — cadastro de
empresas e contatos, entrevista com o questionário completo, registro de dores e
soluções ligadas a elas.
