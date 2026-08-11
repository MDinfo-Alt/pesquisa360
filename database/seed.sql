-- Dados mínimos para o sistema ser utilizável.
-- A guarda é por linha (NOT EXISTS pelo nome/texto), não pela tabela inteira:
-- assim o seed completa o que falta em vez de pular tudo quando já há um
-- registro qualquer. Seguro repetir.

INSERT INTO segmentos (nome)
SELECT v.nome FROM (VALUES
    ('Comércio'), ('Serviços'), ('Alimentação'), ('Saúde'),
    ('Educação'), ('Indústria'), ('Outro')
) AS v(nome)
WHERE NOT EXISTS (SELECT 1 FROM segmentos s WHERE s.nome = v.nome);

INSERT INTO categorias_dores (nome)
SELECT v.nome FROM (VALUES
    ('Processos'), ('Atendimento'), ('Financeiro'), ('Vendas'),
    ('Estoque'), ('Marketing'), ('Outro')
) AS v(nome)
WHERE NOT EXISTS (SELECT 1 FROM categorias_dores c WHERE c.nome = v.nome);

-- Roteiro da pesquisa: docs/requirements/perguntas-pesquisa.md é a fonte da
-- verdade. Alterou lá, altere aqui.

INSERT INTO categorias_perguntas (nome)
SELECT v.nome FROM (VALUES
    ('Processo atual'), ('Dificuldades'), ('Solução atual'), ('Oportunidades')
) AS v(nome)
WHERE NOT EXISTS (SELECT 1 FROM categorias_perguntas c WHERE c.nome = v.nome);

INSERT INTO perguntas (categoria_id, texto, tipo_resposta, ordem)
SELECT c.id, v.texto, v.tipo, v.ordem
FROM (VALUES
    ('Processo atual', 'Como funciona hoje o processo principal da empresa?', 'TEXTO', 1),
    ('Processo atual', 'Quais ferramentas vocês utilizam no dia a dia?', 'MULTIPLA_SELECAO', 2),
    ('Processo atual', 'O que ainda é feito manualmente?', 'TEXTO', 3),
    ('Dificuldades', 'Qual é a maior dificuldade enfrentada atualmente?', 'TEXTO', 4),
    ('Dificuldades', 'Com que frequência essa dificuldade acontece?', 'SELECAO_UNICA', 5),
    ('Dificuldades', 'Qual é o impacto dessa dificuldade para a empresa?', 'TEXTO', 6),
    ('Solução atual', 'Como vocês resolvem esse problema atualmente?', 'TEXTO', 7),
    ('Solução atual', 'O que não funciona bem na solução atual?', 'TEXTO', 8),
    ('Oportunidades', 'Se pudesse melhorar uma coisa hoje, o que seria?', 'TEXTO', 9),
    ('Oportunidades', 'Existe algum outro problema que gostaria de resolver?', 'TEXTO', 10)
) AS v(categoria, texto, tipo, ordem)
JOIN categorias_perguntas c ON c.nome = v.categoria
WHERE NOT EXISTS (SELECT 1 FROM perguntas p WHERE p.texto = v.texto);

INSERT INTO opcoes_perguntas (pergunta_id, texto, ordem)
SELECT p.id, v.texto, v.ordem
FROM (VALUES
    ('Quais ferramentas vocês utilizam no dia a dia?', 'Papel / caderno', 1),
    ('Quais ferramentas vocês utilizam no dia a dia?', 'Planilha', 2),
    ('Quais ferramentas vocês utilizam no dia a dia?', 'WhatsApp', 3),
    ('Quais ferramentas vocês utilizam no dia a dia?', 'Sistema próprio', 4),
    ('Quais ferramentas vocês utilizam no dia a dia?', 'Sistema de terceiros', 5),
    ('Quais ferramentas vocês utilizam no dia a dia?', 'Nenhuma', 6),
    ('Com que frequência essa dificuldade acontece?', 'Diariamente', 1),
    ('Com que frequência essa dificuldade acontece?', 'Algumas vezes por semana', 2),
    ('Com que frequência essa dificuldade acontece?', 'Semanalmente', 3),
    ('Com que frequência essa dificuldade acontece?', 'Mensalmente', 4),
    ('Com que frequência essa dificuldade acontece?', 'Esporadicamente', 5)
) AS v(pergunta, texto, ordem)
JOIN perguntas p ON p.texto = v.pergunta
WHERE NOT EXISTS (
    SELECT 1 FROM opcoes_perguntas o
    WHERE o.pergunta_id = p.id AND o.texto = v.texto
);
