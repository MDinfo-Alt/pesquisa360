
-- Pesquisa360
-- Schema inicial do banco de dados

CREATE TABLE segmentos (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);
