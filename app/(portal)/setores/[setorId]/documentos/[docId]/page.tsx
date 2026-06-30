import { db } from "@/lib/db";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import BadgeStatus from "@/components/documentos/BadgeStatus";
import AcoesAprovacao from "@/components/documentos/AcoesAprovacao";

export default async function DocumentoPage({
  params,
}: {
  params: Promise<{ setorId: string; docId: string }>;
}) {
  const session = await auth();
  const { setorId, docId } = await params;

  const doc = await db.documento.findUnique({
    where: { id: docId },
    include: { setor: true, responsavel: { select: { nome: true } } },
  });

  if (!doc || doc.arquivado) notFound();

  const papel = (session?.user as any)?.papel;
  const podeAprovar = papel === "DONO" || papel === "GESTAO";
  const podeEditar = papel !== "OPERACAO";

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href={`/setores/${setorId}/documentos`}
              className="text-sm text-slate-400 hover:text-slate-600 mb-1 inline-block"
            >
              ← Voltar
            </Link>
            <h1 className="text-xl font-semibold text-slate-900">{doc.titulo}</h1>
            <div className="flex items-center gap-3 mt-2">
              <BadgeStatus status={doc.status} />
              <span className="text-xs text-slate-400">v{doc.versao}</span>
              <span className="text-xs text-slate-400">{doc.tipo}</span>
              {doc.responsavel && (
                <span className="text-xs text-slate-400">por {doc.responsavel.nome}</span>
              )}
              {doc.dataRevisao && (
                <span className="text-xs text-slate-400">
                  Revisão: {new Date(doc.dataRevisao).toLocaleDateString("pt-BR")}
                </span>
              )}
            </div>
          </div>
          {podeEditar && (
            <Link
              href={`/setores/${setorId}/documentos/${docId}/editar`}
              className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 text-sm font-medium rounded-lg transition-colors flex-shrink-0"
            >
              Editar
            </Link>
          )}
        </div>
      </div>

      {/* Fluxo de aprovação */}
      {podeAprovar && doc.status === "EM_REVISAO" && (
        <AcoesAprovacao docId={doc.id} setorSlug={setorId} />
      )}

      {/* Conteúdo */}
      <div className="bg-white rounded-xl border border-slate-200 p-8">
        {doc.conteudoMd ? (
          <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed">
            {doc.conteudoMd}
          </pre>
        ) : (
          <p className="text-slate-400 text-sm italic">Documento sem conteúdo ainda.</p>
        )}
      </div>

      {/* Ação de enviar para revisão */}
      {podeEditar && doc.status === "RASCUNHO" && (
        <div className="mt-4">
          <AcoesAprovacao docId={doc.id} setorSlug={setorId} modo="submeter" />
        </div>
      )}
    </div>
  );
}
