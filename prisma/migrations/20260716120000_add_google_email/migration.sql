-- Adiciona e-mail Google opcional para login social (convite: só quem já
-- está cadastrado com esse e-mail consegue entrar via Google)
ALTER TABLE "Usuario" ADD COLUMN "googleEmail" TEXT;
CREATE UNIQUE INDEX "Usuario_googleEmail_key" ON "Usuario"("googleEmail");
