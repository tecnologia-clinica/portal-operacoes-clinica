import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import FormDocumento from "@/components/documentos/FormDocumento";

export default async function NovoDocumentoPage({
  params,
}: {
  params: Promise<{ setorId: string }>;
}) {
  const { setorId } = await params;
  const setor = await db.setor.findFirst({
    where: { nome: { equals: setorId, mode: "insensitive" } },
  });
  if (!setor) notFound();

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Novo documento</h1>
        <p className="text-sm text-slate-500 mt-0.5">Setor: {setor.nome}</p>
      </div>
      <FormDocumento setorId={setor.id} setorSlug={setorId} />
    </div>
  );
}
