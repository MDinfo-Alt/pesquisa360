-- Dados mínimos para o sistema ser utilizável.
-- Cada bloco só roda se a tabela estiver vazia, então é seguro repetir.

INSERT INTO segmentos (nome)
SELECT * FROM (VALUES
    ('Comércio'), ('Serviços'), ('Alimentação'), ('Saúde'),
    ('Educação'), ('Indústria'), ('Outro')
) AS v(nome)
WHERE NOT EXISTS (SELECT 1 FROM segmentos);

INSERT INTO categorias_dores (nome)
SELECT * FROM (VALUES
    ('Processos'), ('Atendimento'), ('Financeiro'), ('Vendas'),
    ('Estoque'), ('Marketing'), ('Outro')
) AS v(nome)
WHERE NOT EXISTS (SELECT 1 FROM categorias_dores);

INSERT INTO categorias_perguntas (nome)
SELECT * FROM (VALUES
    ('Perfil da empresa'), ('Processos atuais'), ('Tecnologia')
) AS v(nome)
WHERE NOT EXISTS (SELECT 1 FROM categorias_perguntas);

INSERT INTO perguntas (categoria_id, texto, tipo_resposta, ordem)
SELECT c.id, v.texto, v.tipo, v.ordem
FROM (VALUES
    ('Perfil da empresa', 'Há quanto tempo a empresa existe?', 'TEXTO', 1),
    ('Perfil da empresa', 'Quantas pessoas trabalham na empresa?', 'NUMERO', 2),
    ('Processos atuais', 'Como são registrados os pedidos/atendimentos hoje?', 'TEXTO', 3),
    ('Processos atuais', 'Qual parte do processo mais toma tempo?', 'TEXTO', 4),
    ('Tecnologia', 'A empresa utiliza algum sistema hoje?', 'SIM_NAO', 5),
    ('Tecnologia', 'Quais ferramentas são utilizadas no dia a dia?', 'MULTIPLA_SELECAO', 6)
) AS v(categoria, texto, tipo, ordem)
JOIN categorias_perguntas c ON c.nome = v.categoria
WHERE NOT EXISTS (SELECT 1 FROM perguntas);

INSERT INTO opcoes_perguntas (pergunta_id, texto, ordem)
SELECT p.id, v.texto, v.ordem
FROM (VALUES
    ('Papel / caderno', 1), ('Planilha', 2), ('WhatsApp', 3),
    ('Sistema próprio', 4), ('Nenhuma', 5)
) AS v(texto, ordem)
JOIN perguntas p ON p.texto = 'Quais ferramentas são utilizadas no dia a dia?'
WHERE NOT EXISTS (SELECT 1 FROM opcoes_perguntas);
