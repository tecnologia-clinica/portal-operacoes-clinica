import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { homeDoUsuario } from "@/lib/roles";
import GraficoEvolucao, { type PontoEvolucao } from "@/components/painel/GraficoEvolucao";
import GraficoReceita, { type PontoReceita } from "@/components/painel/GraficoReceita";
import DonutMeta from "@/components/painel/DonutMeta";

type Dados = Record<string, number | null>;
type Registro = { mes: number; ano: number; dados: Dados };

const NOME_MES = ["", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const NOME_MES_LONGO = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const META_RECEITA_K = 340; // meta de negócio, não vem do CSV

// Baseline da análise inicial (Diagnóstico Comercial, Kommo 30/06/2026, Dr José Cury Maio26 ads).
// Fica como ponto de partida do histórico; qualquer mês aqui é sobrescrito assim que um CSV real é importado.
const BASELINE_EVOLUCAO: Record<string, PontoEvolucao> = {
  "2026-1": { mes: "Jan", leads: 757,  consultas: 28,   cirurgias: 36 },
  "2026-2": { mes: "Fev", leads: 1207, consultas: 24,   cirurgias: 42 },
  "2026-3": { mes: "Mar", leads: 933,  consultas: 25,   cirurgias: 57 },
  "2026-4": { mes: "Abr", leads: 1234, consultas: 21,   cirurgias: 40 },
  "2026-5": { mes: "Mai", leads: 1152, consultas: 20,   cirurgias: 24 },
  "2026-6": { mes: "Jun", leads: 726,  consultas: null, cirurgias: null },
};
const BASELINE_RECEITA: Record<string, PontoReceita> = {
  "2026-1": { mes: "Jan", receita: 432 },
  "2026-2": { mes: "Fev", receita: 504 },
  "2026-3": { mes: "Mar", receita: 684 },
  "2026-4": { mes: "Abr", receita: 480 },
  "2026-5": { mes: "Mai", receita: 288 },
  "2026-6": { mes: "Jun", receita: null },
};
const BASELINE_RECEITA_K_FALLBACK = 288;

function chave(mes: number, ano: number) {
  return `${ano}-${mes}`;
}

function porSetor(registros: Registro[], setor: string) {
  return registros
    .filter((r) => (r as any).setor === setor)
    .sort((a, b) => (a.ano - b.ano) || (a.mes - b.mes));
}

function pctDelta(atual: number | null | undefined, anterior: number | null | undefined) {
  if (atual == null || anterior == null || anterior === 0) return null;
  return Math.round(((atual - anterior) / anterior) * 100);
}

export default async function PainelPage() {
  const session = await auth();
  const papel = (session?.user as any)?.papel;
  if (papel !== "ADMIN" && papel !== "GERAL") redirect(homeDoUsuario(papel));

  const registrosBrutos = await db.metricaMensal.findMany({
    where: { setor: { in: ["comercial", "marketing", "financeiro", "atendimento"] } },
    orderBy: [{ ano: "asc" }, { mes: "asc" }],
  });
  const registros = registrosBrutos as unknown as (Registro & { setor: string })[];

  const comercial   = porSetor(registros, "comercial");
  const marketing   = porSetor(registros, "marketing");
  const financeiro  = porSetor(registros, "financeiro");
  const atendimento = porSetor(registros, "atendimento");

  const ultimoComercial   = comercial.at(-1)   ?? null;
  const penultimoComercial= comercial.length > 1 ? comercial.at(-2)! : null;
  const ultimoFinanceiro  = financeiro.at(-1)  ?? null;
  const penultimoFinanc   = financeiro.length > 1 ? financeiro.at(-2)! : null;
  const ultimoMarketing   = marketing.at(-1)   ?? null;
  const ultimoAtendimento = atendimento.at(-1) ?? null;

  const temDadosReais = registros.length > 0;

  // KPIs — usam o mês mais recente importado por setor; sem import ainda, caem no valor da análise inicial
  const leadsAtual  = ultimoComercial?.dados.leads_recebidos ?? (temDadosReais ? null : 726);
  const leadsDelta  = pctDelta(ultimoComercial?.dados.leads_recebidos, penultimoComercial?.dados.leads_recebidos) ?? (ultimoComercial ? null : -37);
  const convAtual   = ultimoComercial?.dados.conv_lead_cirurgia_pct ?? (ultimoComercial ? null : 0.53);
  const labelLeadsMes = ultimoComercial ? `${NOME_MES_LONGO[ultimoComercial.mes]} ${ultimoComercial.ano}` : "Junho 2026";

  const cirurgiasAtual = ultimoComercial?.dados.cirurgias_realizadas ?? (temDadosReais ? null : 24);
  const cirurgiasDelta = pctDelta(ultimoComercial?.dados.cirurgias_realizadas, penultimoComercial?.dados.cirurgias_realizadas) ?? (ultimoComercial ? null : -40);

  const consultasAtual = ultimoComercial?.dados.consultas_realizadas ?? (temDadosReais ? null : 20);
  const consultasDelta = pctDelta(ultimoComercial?.dados.consultas_realizadas, penultimoComercial?.dados.consultas_realizadas) ?? (ultimoComercial ? null : -4.8);
  const labelCirurgiasMes = ultimoComercial ? `${NOME_MES[ultimoComercial.mes]}` : "Maio";

  const receitaAtualK = ultimoFinanceiro?.dados.receita_total != null
    ? Math.round(ultimoFinanceiro.dados.receita_total / 1000)
    : BASELINE_RECEITA_K_FALLBACK;
  const receitaAnteriorK = penultimoFinanc?.dados.receita_total != null
    ? Math.round(penultimoFinanc.dados.receita_total / 1000)
    : null;
  const receitaDelta = ultimoFinanceiro
    ? pctDelta(receitaAtualK, receitaAnteriorK)
    : -15;

  const cancelamentosAtual = ultimoComercial?.dados.cancelamentos ?? (ultimoComercial ? null : 50);
  const cacAtual = ultimoMarketing?.dados.cac ?? (ultimoMarketing ? null : 730);
  const respMediaAtual = ultimoAtendimento?.dados.tempo_resposta_min ?? (ultimoAtendimento ? null : 4);

  const METRICAS_RAPIDAS = [
    { label: "Conv. lead→cirurgia", valor: convAtual != null ? `${convAtual}%` : "—",              icon: "⟶" },
    { label: "CAC ads",             valor: cacAtual != null ? `~R$ ${cacAtual}` : "—",              icon: "◎" },
    { label: "Lead frio (jun)",     valor: "64%",                                                    icon: "▦" },
    { label: "Resp. média",         valor: respMediaAtual != null ? `${respMediaAtual} min` : "—",   icon: "★" },
    { label: "Cancelados",          valor: cancelamentosAtual != null ? String(cancelamentosAtual) : "—", icon: "✕" },
    { label: "Leads quentes (jun)", valor: "3",                                                      icon: "↩" },
  ];

  // Série de evolução (leads/consultas/cirurgias) — baseline sobrescrito por dados reais + meses novos anexados
  const serieEvolucao: Record<string, PontoEvolucao> = { ...BASELINE_EVOLUCAO };
  for (const r of comercial) {
    const k = chave(r.mes, r.ano);
    serieEvolucao[k] = {
      mes: NOME_MES[r.mes],
      leads: r.dados.leads_recebidos ?? serieEvolucao[k]?.leads ?? null,
      consultas: r.dados.consultas_realizadas ?? serieEvolucao[k]?.consultas ?? null,
      cirurgias: r.dados.cirurgias_realizadas ?? serieEvolucao[k]?.cirurgias ?? null,
    };
  }
  const evolucao = Object.keys(serieEvolucao)
    .sort((a, b) => {
      const [aa, am] = a.split("-").map(Number);
      const [ba, bm] = b.split("-").map(Number);
      return (aa - ba) || (am - bm);
    })
    .map((k) => serieEvolucao[k]);

  // Série de receita — mesma lógica
  const serieReceita: Record<string, PontoReceita> = { ...BASELINE_RECEITA };
  for (const r of financeiro) {
    const k = chave(r.mes, r.ano);
    serieReceita[k] = {
      mes: NOME_MES[r.mes],
      receita: r.dados.receita_total != null ? Math.round(r.dados.receita_total / 1000) : serieReceita[k]?.receita ?? null,
    };
  }
  const receitaSerie = Object.keys(serieReceita)
    .sort((a, b) => {
      const [aa, am] = a.split("-").map(Number);
      const [ba, bm] = b.split("-").map(Number);
      return (aa - ba) || (am - bm);
    })
    .map((k) => serieReceita[k]);

  return (
    <div className="space-y-5">

      {/* ── Cabeçalho ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#2C1810" }}>Painel Executivo</h1>
          <p className="text-sm mt-0.5" style={{ color: "#9A8570" }}>
            {temDadosReais ? `Dados até ${labelLeadsMes} · atualizado por importação de métricas` : "Junho 2026 · leads completo · clínico parcial (análise inicial)"}
          </p>
        </div>
        <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(200,149,42,0.12)", color: "#A67A1E" }}>
          {labelLeadsMes}
        </span>
      </div>

      {/* ── KPI cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Card destaque — Leads */}
        <div
          className="rounded-2xl p-5 flex flex-col justify-between row-span-1"
          style={{
            background: "linear-gradient(135deg, #C8952A 0%, #A67520 60%, #7C5518 100%)",
            minHeight: 148,
          }}
        >
          <div className="flex items-start justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.6)" }}>
              Leads — {NOME_MES[ultimoComercial?.mes ?? 6]}
            </p>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)" }}>
              {ultimoComercial ? "importado" : "análise inicial"}
            </span>
          </div>
          <div>
            <p className="text-4xl font-bold tracking-tight leading-none mt-3" style={{ color: "#fff" }}>
              {leadsAtual ?? "—"}
            </p>
            {leadsDelta !== null && (
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ color: "#fff", backgroundColor: "rgba(0,0,0,0.2)" }}>
                  {leadsDelta >= 0 ? "▲" : "▼"} {Math.abs(leadsDelta)}% vs mês ant.
                </span>
              </div>
            )}
            <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.55)" }}>
              {convAtual != null ? `${convAtual}% conv. lead→cirurgia` : "conv. lead→cirurgia indisponível"}
            </p>
          </div>
        </div>

        <KPICard label={`Cirurgias — ${labelCirurgiasMes}`} valor={cirurgiasAtual != null ? String(cirurgiasAtual) : "—"} delta={cirurgiasDelta} sub={ultimoComercial ? "dados importados" : "Jun incompleto · pico: Mar (57)"} icon="✦" />
        <KPICard label={`Consultas — ${labelCirurgiasMes}`} valor={consultasAtual != null ? String(consultasAtual) : "—"} delta={consultasDelta} sub={ultimoComercial ? "dados importados" : "Jun incompleto · procedimentos CSV"} icon="◷" />
        <KPICard label="Receita" valor={`R$ ${receitaAtualK}k`} delta={receitaDelta} sub={ultimoFinanceiro ? "dados importados" : "24 cirurg. × ticket est. · a confirmar"} icon="$" />
      </div>

      {/* ── Linha principal: gráfico + painel direito ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Gráfico de evolução */}
        <div className="col-span-2">
          <Suspense fallback={<PlaceholderCard h={320} />}>
            <GraficoEvolucao
              serie={evolucao}
              periodoLabel={`${evolucao[0]?.mes ?? "Jan"} — ${evolucao.at(-1)?.mes ?? "Jun"} 2026`}
              nota={temDadosReais ? "atualizado por CSV importado" : "* cirurgias/consultas Jun incompleto"}
            />
          </Suspense>
        </div>

        {/* Painel direito: donut + métricas rápidas */}
        <div className="flex flex-col gap-4">
          <Suspense fallback={<PlaceholderCard h={260} />}>
            <DonutMeta realizado={receitaAtualK} meta={META_RECEITA_K} />
          </Suspense>

          {/* Mini-métricas */}
          <div className="bg-white rounded-2xl p-4 flex-1" style={{ border: "1px solid #E8DDD0" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#9A8570" }}>
              Indicadores rápidos
            </p>
            <div className="space-y-2.5">
              {METRICAS_RAPIDAS.map((m) => (
                <div key={m.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-4 text-center" style={{ color: "#C8952A" }}>{m.icon}</span>
                    <span className="text-xs" style={{ color: "#6B5744" }}>{m.label}</span>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: "#2C1810" }}>{m.valor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Receita área — largura total ── */}
      <Suspense fallback={<PlaceholderCard h={180} />}>
        <GraficoReceita
          serie={receitaSerie}
          subtitulo={ultimoFinanceiro ? "R$ mil · dados importados do Financeiro" : "R$ mil · cirurgias × ticket est. · a confirmar com financeiro"}
          badge={ultimoFinanceiro ? "real" : "est."}
        />
      </Suspense>
    </div>
  );
}

/* ── Componentes locais ── */

function KPICard({ label, valor, delta, sub, icon }: {
  label: string; valor: string; delta: number | null; sub: string; icon: string;
}) {
  const pos = (delta ?? 0) >= 0;
  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col justify-between" style={{ border: "1px solid #E8DDD0", minHeight: 148 }}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#9A8570" }}>{label}</p>
        <span className="text-base" style={{ color: "#C8952A" }}>{icon}</span>
      </div>
      <div>
        <p className="text-4xl font-bold tracking-tight leading-none mt-3" style={{ color: "#2C1810" }}>{valor}</p>
        {delta !== null && (
          <div className="flex items-center gap-2 mt-3">
            <span
              className="text-xs font-semibold px-1.5 py-0.5 rounded"
              style={{ color: pos ? "#15803D" : "#B91C1C", backgroundColor: pos ? "rgba(21,128,61,0.08)" : "rgba(185,28,28,0.08)" }}
            >
              {pos ? "▲" : "▼"} {Math.abs(delta)}%
            </span>
            <span className="text-xs" style={{ color: "#9A8570" }}>vs mês ant.</span>
          </div>
        )}
        <p className="text-xs mt-2" style={{ color: "#B8A898" }}>{sub}</p>
      </div>
    </div>
  );
}

function PlaceholderCard({ h }: { h: number }) {
  return <div className="bg-white rounded-2xl" style={{ border: "1px solid #E8DDD0", height: h }} />;
}
