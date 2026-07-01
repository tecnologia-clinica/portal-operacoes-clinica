import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { auditLog } from "@/lib/audit";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const papel = (session.user as any).papel;
  if (papel !== "DONO" && papel !== "GESTAO") {
    return NextResponse.json({ error: "Apenas Gestão ou Dono podem aprovar" }, { status: 403 });
  }

  const { id } = await params;
  const { acao, comentario } = await req.json();

  if (!["APROVAR", "SOLICITAR_REVISAO"].includes(acao)) {
    return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
  }

  const novoStatus = acao === "APROVAR" ? "APROVADO" : "EM_REVISAO";

  const doc = await db.documento.update({
    where: { id },
    data: { status: novoStatus },
  });

  await auditLog((session.user as any).id, "Documento", id, acao, { comentario });
  return NextResponse.json(doc);
}
