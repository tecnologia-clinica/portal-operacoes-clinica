import { db } from "@/lib/db";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import BadgeStatus from "@/components/documentos/BadgeStatus";

export default async function DocumentosPage({
  params,
  searchParams,
}: {
  params: Promise<{ setorId: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await auth();
  const { setorId } = await params;
  const { status } = await searchParams;

  const setor = await db.setor.findFirst({ where: { nome: { equals: setorId, mode: "insensitive" } } });
  if (!setor) notFound();

  const docs = await db.documento.findMany({
    where: {
      setorId: setor.id,
      arquivado: false,
      ...(status && { status: status as any }),
    },
    include: { responsavel: { select: { nome: true } } },
    orderBy: { atualizadoEm: "desc" },
  });

  const papel = (session?.user as any)?.papel;
  const podeAprovar = papel === "DONO" || papel === "GESTAO";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Documentação — {setor.nome}</h1>
          <p className="text-sm text-slate-500 mt-0.5">POPs, políticas e descrições de cargo</p>
        </div>
        <Link
          href={`/setores/${setorId}/documentos/novo`}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Novo documento
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-5">
        {[
          { label: "Todos", value: "" },
          { label: "Aprovados", value: "APROVADO" },
          { label: "Em revisão", value: "EM_REVISAO" },
          { label: "Rascunhos", value: "RASCUNHO" },
        ].map((f) => (
          <Link
            key={f.value}
            href={`/setores/${setorId}/documentos${f.value ? `?status=${f.value}` : ""}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              (status ?? "") === f.value
                ? "bg-blue-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {docs.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            Nenhum documento encontrado.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Título</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Tipo</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Versão</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Responsável</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Revisão</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {docs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-800">{doc.titulo}</td>
                  <td className="px-4 py-3.5 text-slate-500">{doc.tipo}</td>
                  <td className="px-4 py-3.5"><BadgeStatus status={doc.status} /></td>
                  <td className="px-4 py-3.5 text-slate-500">v{doc.versao}</td>
                  <td className="px-4 py-3.5 text-slate-500">{doc.responsavel?.nome ?? "—"}</td>
                  <td className="px-4 py-3.5 text-slate-500">
                    {doc.dataRevisao ? new Date(doc.dataRevisao).toLocaleDateString("pt-BR") : "—"}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Link
                      href={`/setores/${setorId}/documentos/${doc.id}`}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                    >
                      Abrir →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
