import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { auditLog } from "@/lib/audit";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const doc = await db.documento.findUnique({
    where: { id },
    include: { setor: true, responsavel: { select: { nome: true } } },
  });

  if (!doc) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { titulo, conteudoMd, dataRevisao, status } = body;

  const atual = await db.documento.findUnique({ where: { id } });
  if (!atual) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });

  const novaVersao = conteudoMd && conteudoMd !== atual.conteudoMd
    ? atual.versao + 1
    : atual.versao;

  const doc = await db.documento.update({
    where: { id },
    data: {
      ...(titulo && { titulo }),
      ...(conteudoMd !== undefined && { conteudoMd }),
      ...(dataRevisao !== undefined && { dataRevisao: dataRevisao ? new Date(dataRevisao) : null }),
      ...(status && { status }),
      versao: novaVersao,
    },
  });

  await auditLog((session.user as any).id, "Documento", id, "EDITAR", body);
  return NextResponse.json(doc);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const papel = (session.user as any).papel;
  if (papel !== "DONO" && papel !== "GESTAO") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { id } = await params;
  await db.documento.update({ where: { id }, data: { arquivado: true } });
  await auditLog((session.user as any).id, "Documento", id, "ARQUIVAR");
  return NextResponse.json({ ok: true });
}
