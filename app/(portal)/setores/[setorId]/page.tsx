import { redirect } from "next/navigation";

export default async function SetorPage({ params }: { params: Promise<{ setorId: string }> }) {
  const { setorId } = await params;
  redirect(`/setores/${setorId}/documentos`);
}
