-- Desativa as perguntas anteriores ao roteiro definitivo
-- (docs/requirements/perguntas-pesquisa.md).
--
-- Só para bancos criados antes do roteiro. As perguntas não são apagadas:
-- as respostas já coletadas continuam ligadas a elas e seguem visíveis na
-- tela da entrevista. Inativas, elas somem das entrevistas novas (RN04).
--
-- Rode depois de `npm run db:seed`, para não desativar o roteiro novo junto.

UPDATE perguntas
SET ativa = FALSE
WHERE texto NOT IN (
    'Como funciona hoje o processo principal da empresa?',
    'Quais ferramentas vocês utilizam no dia a dia?',
    'O que ainda é feito manualmente?',
    'Qual é a maior dificuldade enfrentada atualmente?',
    'Com que frequência essa dificuldade acontece?',
    'Qual é o impacto dessa dificuldade para a empresa?',
    'Como vocês resolvem esse problema atualmente?',
    'O que não funciona bem na solução atual?',
    'Se pudesse melhorar uma coisa hoje, o que seria?',
    'Existe algum outro problema que gostaria de resolver?'
);
