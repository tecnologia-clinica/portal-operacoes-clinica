import { db } from "@/lib/db";

export async function auditLog(
  usuarioId: string | null,
  entidade: string,
  entidadeId: string,
  acao: string,
  payload?: object
) {
  await db.auditLog.create({
    data: { usuarioId, entidade, entidadeId, acao, payload },
  });
}
