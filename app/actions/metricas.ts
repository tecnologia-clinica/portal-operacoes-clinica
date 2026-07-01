"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function importarMetricas(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Sem permissão");

  const setor   = (formData.get("setor") as string)?.trim();
  const mes     = parseInt(formData.get("mes") as string);
  const ano     = parseInt(formData.get("ano") as string);
  const arquivo = formData.get("arquivo") as File;

  const setoresValidos = ["comercial", "marketing", "clinico", "atendimento", "experiencia"];
  if (!setoresValidos.includes(setor))       throw new Error("Setor inválido");
  if (!mes || mes < 1 || mes > 12)           throw new Error("Mês inválido");
  if (!ano || ano < 2024 || ano > 2035)      throw new Error("Ano inválido");
  if (!arquivo || arquivo.size === 0)        throw new Error("Nenhum arquivo enviado");
  if (!arquivo.name.endsWith(".csv"))        throw new Error("Arquivo deve ser .csv");
  if (arquivo.size > 500_000)               throw new Error("Arquivo muito grande (máx 500 KB)");

  const texto = await arquivo.text();
  const linhas = texto.trim().split(/\r?\n/).filter((l) => l.trim());

  if (linhas.length < 2) throw new Error("CSV vazio ou inválido");

  const cabecalho = linhas[0].toLowerCase();
  if (!cabecalho.includes("metrica") || !cabecalho.includes("valor")) {
    throw new Error('Formato inválido. A primeira linha deve ser: metrica,valor');
  }

  const dados: Record<string, number | null> = {};
  for (let i = 1; i < linhas.length; i++) {
    const partes = linhas[i].split(",");
    if (partes.length < 2) continue;
    const chave   = partes[0].trim().toLowerCase().replace(/\s+/g, "_");
    const rawVal  = partes[1].trim();
    if (!chave || rawVal === "") continue;
    const val = parseFloat(rawVal);
    dados[chave] = isNaN(val) ? null : val;
  }

  if (Object.keys(dados).length === 0) throw new Error("Nenhuma métrica encontrada no arquivo");

  await db.metricaMensal.upsert({
    where:  { setor_mes_ano: { setor, mes, ano } },
    create: { setor, mes, ano, dados, autorId: session.user!.id },
    update: { dados, autorId: session.user!.id },
  });

  revalidatePath("/metricas/importar");
  revalidatePath("/metricas");
  revalidatePath("/indicadores");
  revalidatePath("/painel");
}
