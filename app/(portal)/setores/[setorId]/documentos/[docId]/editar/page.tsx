import { db } from "@/lib/db";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import FormDocumento from "@/components/documentos/FormDocumento";

export default async function EditarDocumentoPage({
  params,
}: {
  params: Promise<{ setorId: string; docId: string }>;
}) {
  const session = await auth();
  const papel = (session?.user as any)?.papel;
  if (papel === "OPERACAO") redirect("/painel");

  const { setorId, docId } = await params;

  const doc = await db.documento.findUnique({
    where: { id: docId },
    select: {
      id: true, titulo: true, tipo: true, conteudoMd: true,
      dataRevisao: true, arquivado: true,
    },
  });

  if (!doc || doc.arquivado) notFound();

  const dataRevisaoStr = doc.dataRevisao
    ? doc.dataRevisao.toISOString().split("T")[0]
    : "";

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold" style={{ color: "#2C1810" }}>Editar documento</h1>
        <p className="text-sm mt-0.5" style={{ color: "#9A8570" }}>
          Alterações incrementam a versão do documento
        </p>
      </div>
      <FormDocumento
        setorId=""
        setorSlug={setorId}
        docId={docId}
        inicial={{
          titulo: doc.titulo,
          tipo: doc.tipo,
          conteudoMd: doc.conteudoMd,
          dataRevisao: dataRevisaoStr,
        }}
      />
    </div>
  );
}
