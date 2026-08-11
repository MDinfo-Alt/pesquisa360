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

INSERT INTO categorias_perguntas (nome)
SELECT v.nome FROM (VALUES
    ('Perfil da empresa'), ('Processos atuais'), ('Tecnologia')
) AS v(nome)
WHERE NOT EXISTS (SELECT 1 FROM categorias_perguntas c WHERE c.nome = v.nome);

-- A ordem entra depois da maior já existente, para não colidir com perguntas
-- cadastradas à mão. MAX é avaliado uma vez, no início do INSERT.
INSERT INTO perguntas (categoria_id, texto, tipo_resposta, ordem)
SELECT
    c.id,
    v.texto,
    v.tipo,
    v.ordem + COALESCE((SELECT MAX(ordem) FROM perguntas), 0)
FROM (VALUES
    ('Perfil da empresa', 'Há quanto tempo a empresa existe?', 'TEXTO', 1),
    ('Perfil da empresa', 'Quantas pessoas trabalham na empresa?', 'NUMERO', 2),
    ('Processos atuais', 'Como são registrados os pedidos/atendimentos hoje?', 'TEXTO', 3),
    ('Processos atuais', 'Qual parte do processo mais toma tempo?', 'TEXTO', 4),
    ('Tecnologia', 'A empresa utiliza algum sistema hoje?', 'SIM_NAO', 5),
    ('Tecnologia', 'Quais ferramentas são utilizadas no dia a dia?', 'MULTIPLA_SELECAO', 6)
) AS v(categoria, texto, tipo, ordem)
JOIN categorias_perguntas c ON c.nome = v.categoria
WHERE NOT EXISTS (SELECT 1 FROM perguntas p WHERE p.texto = v.texto);

INSERT INTO opcoes_perguntas (pergunta_id, texto, ordem)
SELECT p.id, v.texto, v.ordem
FROM (VALUES
    ('Papel / caderno', 1), ('Planilha', 2), ('WhatsApp', 3),
    ('Sistema próprio', 4), ('Nenhuma', 5)
) AS v(texto, ordem)
JOIN perguntas p ON p.texto = 'Quais ferramentas são utilizadas no dia a dia?'
WHERE NOT EXISTS (
    SELECT 1 FROM opcoes_perguntas o
    WHERE o.pergunta_id = p.id AND o.texto = v.texto
);
