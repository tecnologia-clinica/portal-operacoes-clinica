import { db } from "@/lib/db";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import BadgeStatus from "@/components/documentos/BadgeStatus";

const SLUG_NOME: Record<string, string> = {
  comercial: "Comercial",
  marketing: "Marketing",
  "clinico-cirurgico": "Clínico / Cirúrgico",
  atendimento: "Atendimento",
  "pos-operatorio": "Pós-operatório",
};

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

  const nomeSetor = SLUG_NOME[setorId];
  if (!nomeSetor) notFound();

  const setor = await db.setor.findFirst({ where: { nome: nomeSetor } });
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#2C1810" }}>
            Documentação — {setor.nome}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#9A8570" }}>
            POPs, políticas e descrições de cargo
          </p>
        </div>
        <Link
          href={`/setores/${setorId}/documentos/novo`}
          className="px-4 py-2 text-white text-sm font-medium rounded-lg opacity-100 hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#C8952A" }}
        >
          + Novo documento
        </Link>
      </div>

      <div className="flex gap-2 mb-5">
        {[
          { label: "Todos", value: "" },
          { label: "Aprovados", value: "APROVADO" },
          { label: "Em revisão", value: "EM_REVISAO" },
          { label: "Rascunhos", value: "RASCUNHO" },
        ].map((f) => {
          const active = (status ?? "") === f.value;
          return (
            <Link
              key={f.value}
              href={`/setores/${setorId}/documentos${f.value ? `?status=${f.value}` : ""}`}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
              style={
                active
                  ? { backgroundColor: "#C8952A", color: "#fff" }
                  : { backgroundColor: "#fff", border: "1px solid #E8DDD0", color: "#6B5744" }
              }
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #E8DDD0" }}>
        {docs.length === 0 ? (
          <div className="py-16 text-center text-sm" style={{ color: "#9A8570" }}>
            Nenhum documento encontrado.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #F0E8DD", backgroundColor: "#FBF8F4" }}>
                <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wide" style={{ color: "#9A8570" }}>Título</th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide" style={{ color: "#9A8570" }}>Tipo</th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide" style={{ color: "#9A8570" }}>Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide" style={{ color: "#9A8570" }}>Versão</th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide" style={{ color: "#9A8570" }}>Responsável</th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide" style={{ color: "#9A8570" }}>Revisão</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {docs.map((doc) => (
                <tr key={doc.id} style={{ borderTop: "1px solid #F7F3EE" }}>
                  <td className="px-5 py-3.5 font-medium" style={{ color: "#2C1810" }}>{doc.titulo}</td>
                  <td className="px-4 py-3.5" style={{ color: "#9A8570" }}>{doc.tipo}</td>
                  <td className="px-4 py-3.5"><BadgeStatus status={doc.status} /></td>
                  <td className="px-4 py-3.5" style={{ color: "#9A8570" }}>v{doc.versao}</td>
                  <td className="px-4 py-3.5" style={{ color: "#9A8570" }}>{doc.responsavel?.nome ?? "—"}</td>
                  <td className="px-4 py-3.5" style={{ color: "#9A8570" }}>
                    {doc.dataRevisao ? new Date(doc.dataRevisao).toLocaleDateString("pt-BR") : "—"}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Link
                      href={`/setores/${setorId}/documentos/${doc.id}`}
                      className="text-xs font-medium hover:opacity-70 transition-opacity"
                      style={{ color: "#C8952A" }}
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
