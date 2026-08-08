
-- Pesquisa360
-- Schema inicial do banco de dados

CREATE TABLE segmentos (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE empresas (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    segmento_id INTEGER NOT NULL,
    nome VARCHAR(150) NOT NULL,
    telefone_whatsapp VARCHAR(30),
    endereco VARCHAR(200),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    site VARCHAR(255),
    status VARCHAR(30),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_empresas_segmento
        FOREIGN KEY (segmento_id)
        REFERENCES segmentos(id)
);
CREATE TABLE contatos (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    empresa_id INTEGER NOT NULL,
    nome VARCHAR(150) NOT NULL,
    cargo VARCHAR(100),

    CONSTRAINT fk_contatos_empresa
        FOREIGN KEY (empresa_id)
        REFERENCES empresas(id)
);
CREATE TABLE entrevistas (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    empresa_id INTEGER NOT NULL,
    contato_id INTEGER,
    data_entrevista DATE NOT NULL,
    observacoes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_entrevistas_empresa
        FOREIGN KEY (empresa_id)
        REFERENCES empresas(id),

    CONSTRAINT fk_entrevistas_contato
        FOREIGN KEY (contato_id)
        REFERENCES contatos(id)
);

CREATE TABLE categorias_perguntas (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE perguntas (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    categoria_id INTEGER NOT NULL,
    texto TEXT NOT NULL,
    tipo_resposta VARCHAR(30) NOT NULL,
    ordem INTEGER NOT NULL,
    ativa BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_perguntas_categoria
        FOREIGN KEY (categoria_id)
        REFERENCES categorias_perguntas(id)
);

CREATE TABLE opcoes_perguntas (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pergunta_id INTEGER NOT NULL,
    texto VARCHAR(150) NOT NULL,
    ordem INTEGER NOT NULL,
    ativa BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_opcoes_perguntas_pergunta
        FOREIGN KEY (pergunta_id)
        REFERENCES perguntas(id)
);

CREATE TABLE respostas (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    entrevista_id INTEGER NOT NULL,
    pergunta_id INTEGER NOT NULL,
    valor TEXT,

    CONSTRAINT fk_respostas_entrevista
        FOREIGN KEY (entrevista_id)
        REFERENCES entrevistas(id),

    CONSTRAINT fk_respostas_pergunta
        FOREIGN KEY (pergunta_id)
        REFERENCES perguntas(id),

    CONSTRAINT uq_resposta_entrevista_pergunta
        UNIQUE (entrevista_id, pergunta_id)
);

CREATE TABLE opcoes_respostas (
    resposta_id INTEGER NOT NULL,
    opcao_pergunta_id INTEGER NOT NULL,

    PRIMARY KEY (resposta_id, opcao_pergunta_id),

    CONSTRAINT fk_opcoes_respostas_resposta
        FOREIGN KEY (resposta_id)
        REFERENCES respostas(id),

    CONSTRAINT fk_opcoes_respostas_opcao
        FOREIGN KEY (opcao_pergunta_id)
        REFERENCES opcoes_perguntas(id)
);
