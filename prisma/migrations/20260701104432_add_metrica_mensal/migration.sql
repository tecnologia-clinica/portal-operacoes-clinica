-- CreateTable
CREATE TABLE "metrica_mensal" (
    "id" TEXT NOT NULL,
    "setor" TEXT NOT NULL,
    "mes" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "dados" JSONB NOT NULL,
    "autorId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "metrica_mensal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "metrica_mensal_setor_mes_ano_key" ON "metrica_mensal"("setor", "mes", "ano");

-- AddForeignKey
ALTER TABLE "metrica_mensal" ADD CONSTRAINT "metrica_mensal_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
