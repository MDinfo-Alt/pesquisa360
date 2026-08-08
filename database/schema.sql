
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
