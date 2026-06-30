"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type MetaItem = {
  label: string;
  meta: number;
  realizado: number;
  unidade: string;
  fonte: string;
};

export async function salvarAcompanhamento(slug: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autorizado");

  const [ano, mes] = slug.split("-").map(Number);

  const linhas = (field: string) =>
    ((formData.get(field) as string) ?? "").split("\n").map((l) => l.trim()).filter(Boolean);

  const destaques     = linhas("destaques");
  const desafios      = linhas("desafios");
  const pendencias    = linhas("pendencias");
  const proximosMeses = linhas("proximosMeses");
  const observacoes   = (formData.get("observacoes") as string) ?? "";

  const metasLabels  = formData.getAll("meta_label")  as string[];
  const metasMeta    = formData.getAll("meta_meta")    as string[];
  const metasReal    = formData.getAll("meta_real")    as string[];
  const metasUnidade = formData.getAll("meta_unidade") as string[];
  const metasFonte   = formData.getAll("meta_fonte")   as string[];

  const metas: MetaItem[] = metasLabels.map((label, i) => ({
    label,
    meta:       parseFloat(metasMeta[i]  ?? "0"),
    realizado:  parseFloat(metasReal[i]  ?? "0"),
    unidade:    metasUnidade[i] ?? "",
    fonte:      metasFonte[i]  ?? "",
  }));

  const publicar = formData.get("publicar") === "1";

  await db.acompanhamentoMensal.upsert({
    where: { mes_ano: { mes, ano } },
    create: {
      mes, ano,
      status: publicar ? "publicado" : "rascunho",
      destaques, desafios, pendencias, proximosMeses,
      metas, observacoes: observacoes || null,
      autorId: session.user.id,
    },
    update: {
      status: publicar ? "publicado" : "rascunho",
      destaques, desafios, pendencias, proximosMeses,
      metas, observacoes: observacoes || null,
    },
  });

  revalidatePath(`/acompanhamento/${slug}`);
  revalidatePath("/acompanhamento");
  redirect(`/acompanhamento/${slug}`);
}
