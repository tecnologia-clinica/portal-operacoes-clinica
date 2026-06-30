import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { auditLog } from "@/lib/audit";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const setorId = searchParams.get("setorId");
  const status = searchParams.get("status");

  const docs = await db.documento.findMany({
    where: {
      arquivado: false,
      ...(setorId && { setorId }),
      ...(status && { status: status as any }),
    },
    include: { setor: true, responsavel: { select: { nome: true } } },
    orderBy: { atualizadoEm: "desc" },
  });

  return NextResponse.json(docs);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await req.json();
  const { titulo, setorId, tipo, conteudoMd, dataRevisao } = body;

  if (!titulo || !setorId || !tipo) {
    return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
  }

  const doc = await db.documento.create({
    data: {
      titulo,
      setorId,
      tipo,
      conteudoMd: conteudoMd ?? "",
      status: "RASCUNHO",
      versao: 1,
      responsavelId: (session.user as any).id,
      dataRevisao: dataRevisao ? new Date(dataRevisao) : null,
    },
  });

  await auditLog((session.user as any).id, "Documento", doc.id, "CRIAR", { titulo, tipo });

  return NextResponse.json(doc, { status: 201 });
}
