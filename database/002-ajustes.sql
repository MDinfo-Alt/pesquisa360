-- Ajustes para bancos criados antes dos campos previstos nos RFs.
-- Em banco novo, basta rodar schema.sql (já contém tudo). Este arquivo é seguro
-- de rodar mais de uma vez.

ALTER TABLE empresas ADD COLUMN IF NOT EXISTS instagram VARCHAR(255);
ALTER TABLE empresas ADD COLUMN IF NOT EXISTS qtd_funcionarios INTEGER;
ALTER TABLE empresas ADD COLUMN IF NOT EXISTS observacoes TEXT;
UPDATE empresas SET status = 'PROSPECTADO' WHERE status IS NULL;
ALTER TABLE empresas ALTER COLUMN status SET DEFAULT 'PROSPECTADO';
ALTER TABLE empresas ALTER COLUMN status SET NOT NULL;

ALTER TABLE contatos ADD COLUMN IF NOT EXISTS telefone_whatsapp VARCHAR(30);
ALTER TABLE contatos ADD COLUMN IF NOT EXISTS email VARCHAR(150);
ALTER TABLE contatos ADD COLUMN IF NOT EXISTS observacoes TEXT;

ALTER TABLE solucoes ADD COLUMN IF NOT EXISTS status VARCHAR(30) NOT NULL DEFAULT 'IDEIA';
