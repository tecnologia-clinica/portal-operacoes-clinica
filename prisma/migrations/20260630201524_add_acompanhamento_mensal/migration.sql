-- CreateTable
CREATE TABLE "acompanhamento_mensal" (
    "id" TEXT NOT NULL,
    "mes" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'rascunho',
    "destaques" JSONB NOT NULL DEFAULT '[]',
    "desafios" JSONB NOT NULL DEFAULT '[]',
    "pendencias" JSONB NOT NULL DEFAULT '[]',
    "proximosMeses" JSONB NOT NULL DEFAULT '[]',
    "metas" JSONB NOT NULL DEFAULT '[]',
    "observacoes" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "autorId" TEXT NOT NULL,

    CONSTRAINT "acompanhamento_mensal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "acompanhamento_mensal_mes_ano_key" ON "acompanhamento_mensal"("mes", "ano");

-- AddForeignKey
ALTER TABLE "acompanhamento_mensal" ADD CONSTRAINT "acompanhamento_mensal_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
