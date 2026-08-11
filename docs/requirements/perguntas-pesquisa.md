# Roteiro da pesquisa

Perguntas aplicadas durante a visita, na ordem em que aparecem no questionário.
Esta é a fonte da verdade: `database/seed.sql` cadastra exatamente estas perguntas.

## Estrutura

O roteiro segue quatro momentos da conversa: entender como a empresa trabalha,
identificar a dificuldade, entender o que já tentaram e abrir espaço para o que
o entrevistado quiser trazer.

## Perguntas

### Processo atual

| # | Pergunta | Tipo de resposta |
|---|---|---|
| 1 | Como funciona hoje o processo principal da empresa? | Texto |
| 2 | Quais ferramentas vocês utilizam no dia a dia? | Múltipla seleção |
| 3 | O que ainda é feito manualmente? | Texto |

Opções da pergunta 2: Papel / caderno, Planilha, WhatsApp, Sistema próprio,
Sistema de terceiros, Nenhuma.

### Dificuldades

| # | Pergunta | Tipo de resposta |
|---|---|---|
| 4 | Qual é a maior dificuldade enfrentada atualmente? | Texto |
| 5 | Com que frequência essa dificuldade acontece? | Seleção única |
| 6 | Qual é o impacto dessa dificuldade para a empresa? | Texto |

Opções da pergunta 5: Diariamente, Algumas vezes por semana, Semanalmente,
Mensalmente, Esporadicamente.

### Solução atual

| # | Pergunta | Tipo de resposta |
|---|---|---|
| 7 | Como vocês resolvem esse problema atualmente? | Texto |
| 8 | O que não funciona bem na solução atual? | Texto |

### Oportunidades

| # | Pergunta | Tipo de resposta |
|---|---|---|
| 9 | Se pudesse melhorar uma coisa hoje, o que seria? | Texto |
| 10 | Existe algum outro problema que gostaria de resolver? | Texto |

## Como alterar o roteiro

RN04 (RF03) exige que perguntas possam mudar sem afetar entrevistas já
registradas. Por isso:

- **Adicionar pergunta**: acrescente a linha em `seed.sql` e rode `npm run db:seed`.
  A guarda é por texto, então nada é duplicado.
- **Remover pergunta**: marque `ativa = FALSE` em vez de apagar. As respostas já
  coletadas continuam visíveis na tela da entrevista; a pergunta some das
  entrevistas novas.
- **Alterar o texto**: cria uma pergunta nova na prática. Desative a antiga e
  cadastre a nova, senão as respostas antigas passam a responder a uma pergunta
  que não foi a feita na visita.

As perguntas usadas antes deste roteiro foram desativadas por
`database/003-roteiro-pesquisa.sql`.
