# Banco de Dados — Pesquisa360

Este diretório contém os arquivos relacionados ao banco de dados do projeto.

## Arquivos

- `schema.sql` — estrutura do banco de dados PostgreSQL.
- `002-ajustes.sql` — colunas acrescentadas depois (rodar só em banco já existente).
- `seed.sql` — segmentos, categorias e perguntas iniciais. Cada bloco só roda se a tabela estiver vazia.
- `README.md` — documentação do banco.

## Como aplicar

Pelo backend, sem precisar do `psql` no PATH:

```bash
cd backend
npm run db:schema    # banco novo
npm run db:ajustes   # banco criado antes das colunas dos RFs
npm run db:seed
```
