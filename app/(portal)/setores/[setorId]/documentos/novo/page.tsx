import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import FormDocumento from "@/components/documentos/FormDocumento";

const SLUG_NOME: Record<string, string> = {
  comercial: "Comercial",
  marketing: "Marketing",
  "clinico-cirurgico": "Clínico / Cirúrgico",
  atendimento: "Atendimento",
  "pos-operatorio": "Pós-operatório",
};

export default async function NovoDocumentoPage({
  params,
}: {
  params: Promise<{ setorId: string }>;
}) {
  const { setorId } = await params;
  const nomeSetor = SLUG_NOME[setorId];
  if (!nomeSetor) notFound();

  const setor = await db.setor.findFirst({ where: { nome: nomeSetor } });
  if (!setor) notFound();

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold" style={{ color: "#2C1810" }}>Novo documento</h1>
        <p className="text-sm mt-0.5" style={{ color: "#9A8570" }}>Setor: {setor.nome}</p>
      </div>
      <FormDocumento setorId={setor.id} setorSlug={setorId} />
    </div>
  );
}
