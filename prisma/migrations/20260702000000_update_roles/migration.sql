-- Converte enum Papel para os novos roles departamentais
-- DONO/GESTAO → ADMIN, LIDER/OPERACAO → GERAL

-- Passo 1: remover default antes de dropar o enum
ALTER TABLE "Usuario" ALTER COLUMN "papel" DROP DEFAULT;

-- Passo 2: converter coluna para TEXT temporariamente
ALTER TABLE "Usuario" ALTER COLUMN "papel" TYPE TEXT;

-- Passo 3: remover enum antigo
DROP TYPE "Papel";

-- Passo 3: criar novo enum
CREATE TYPE "Papel" AS ENUM ('ADMIN', 'FINANCEIRO', 'COMERCIAL', 'MARKETING', 'EXPERIENCIA', 'GERAL');

-- Passo 4: migrar dados
UPDATE "Usuario" SET "papel" = CASE
  WHEN "papel" IN ('DONO', 'GESTAO') THEN 'ADMIN'
  ELSE 'GERAL'
END;

-- Passo 5: converter coluna de volta para o novo enum
ALTER TABLE "Usuario" ALTER COLUMN "papel" TYPE "Papel" USING "papel"::"Papel";

-- Passo 6: definir default
ALTER TABLE "Usuario" ALTER COLUMN "papel" SET DEFAULT 'GERAL'::"Papel";
