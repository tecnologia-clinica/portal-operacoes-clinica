import { Suspense } from "react";
import GraficoEvolucao from "@/components/painel/GraficoEvolucao";
import GraficoReceita from "@/components/painel/GraficoReceita";

interface KPI {
  label: string;
  valor: string;
  delta: number;
  deltaLabel: string;
  sub: string;
}

const KPIS: KPI[] = [
  { label: "Leads recebidos",     valor: "187",      delta:  3.3, deltaLabel: "vs maio", sub: "Tráfego pago + orgânico" },
  { label: "Consultas agendadas", valor: "43",       delta:  7.5, deltaLabel: "vs maio", sub: "23% de conversão lead→consulta" },
  { label: "Cirurgias realizadas",valor: "22",       delta: -4.3, deltaLabel: "vs maio", sub: "Ticket médio R$ 11.227" },
  { label: "Receita bruta",       valor: "R$ 247k",  delta:  2.5, deltaLabel: "vs maio", sub: "Meta: R$ 260k" },
];

const METRICAS = [
  { label: "CAC médio",                 valor: "R$ 485", note: "por lead qualificado" },
  { label: "Taxa consulta→cirurgia",    valor: "51%",    note: "22 de 43 consultas" },
  { label: "Ocupação da agenda",        valor: "74%",    note: "slots preenchidos" },
  { label: "NPS",                       valor: "72",     note: "Promotores: 68%" },
  { label: "Cirurgias canceladas",      valor: "3",      note: "13,6% do agendado" },
  { label: "Retornos pós-op",           valor: "18",     note: "de 22 cirurgias" },
];

function KPICard({ kpi }: { kpi: KPI }) {
  const pos = kpi.delta >= 0;
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{
        backgroundColor: "#241408",
        border: "1px solid rgba(200,149,42,0.18)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#6B5030" }}>
        {kpi.label}
      </p>
      <p className="text-4xl font-semibold tracking-tight leading-none" style={{ color: "#F0E6D8" }}>
        {kpi.valor}
      </p>
      <div className="flex items-center gap-2">
        <span
          className="text-xs font-semibold px-1.5 py-0.5 rounded"
          style={{
            color: pos ? "#4ADE80" : "#F87171",
            backgroundColor: pos ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
          }}
        >
          {pos ? "▲" : "▼"} {Math.abs(kpi.delta)}%
        </span>
        <span className="text-xs" style={{ color: "#5C4030" }}>{kpi.deltaLabel}</span>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: "#5C4030" }}>{kpi.sub}</p>
    </div>
  );
}

export default function PainelPage() {
  return (
    <div className="-m-6 min-h-full flex flex-col">

      {/* ── Dark header ── */}
      <div style={{ backgroundColor: "#1A0E06", padding: "36px 32px 88px" }}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: "#F0E6D8" }}>
              Painel Executivo
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6B5030" }}>
              Junho 2026 — visão consolidada
            </p>
          </div>
          <span
            className="text-xs font-medium px-3 py-1 rounded-full mt-1"
            style={{ backgroundColor: "rgba(200,149,42,0.12)", color: "#C8952A" }}
          >
            Atualizado manualmente
          </span>
        </div>
      </div>

      {/* ── KPI cards flutuando na transição ── */}
      <div style={{ margin: "0 24px", marginTop: -56, position: "relative", zIndex: 10 }}>
        <div className="grid grid-cols-4 gap-4">
          {KPIS.map((k) => <KPICard key={k.label} kpi={k} />)}
        </div>
      </div>

      {/* ── Conteúdo claro ── */}
      <div className="flex-1" style={{ backgroundColor: "#F7F3EE", padding: "28px 24px 32px" }}>

        {/* Gráficos */}
        <div className="grid grid-cols-3 gap-5 mb-5">
          <div className="col-span-2">
            <Suspense fallback={
              <div className="bg-white rounded-2xl h-[316px]" style={{ border: "1px solid #E8DDD0" }} />
            }>
              <GraficoEvolucao />
            </Suspense>
          </div>
          <div className="flex flex-col gap-4">
            <Suspense fallback={
              <div className="bg-white rounded-2xl h-[168px]" style={{ border: "1px solid #E8DDD0" }} />
            }>
              <GraficoReceita />
            </Suspense>

            {/* Meta */}
            <div className="bg-white rounded-2xl p-5 flex-1" style={{ border: "1px solid #E8DDD0" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#9A8570" }}>
                Meta receita junho
              </p>
              <div className="flex items-end justify-between mb-3">
                <span className="text-2xl font-semibold" style={{ color: "#2C1810" }}>R$ 247k</span>
                <span className="text-xs" style={{ color: "#9A8570" }}>de R$ 260k</span>
              </div>
              <div className="w-full rounded-full h-2.5" style={{ backgroundColor: "#F0E8DD" }}>
                <div className="h-2.5 rounded-full" style={{ width: "95%", backgroundColor: "#C8952A" }} />
              </div>
              <p className="text-xs mt-2" style={{ color: "#9A8570" }}>95% da meta atingida</p>
            </div>
          </div>
        </div>

        {/* Métricas detalhadas */}
        <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #E8DDD0" }}>
          <div className="px-6 py-4" style={{ borderBottom: "1px solid #F0E8DD" }}>
            <p className="text-sm font-semibold" style={{ color: "#2C1810" }}>
              Indicadores detalhados — Junho 2026
            </p>
          </div>
          <div className="grid grid-cols-3">
            {METRICAS.map((m, i) => (
              <div
                key={m.label}
                className="px-6 py-4"
                style={{
                  borderRight: i % 3 !== 2 ? "1px solid #F0E8DD" : "none",
                  borderBottom: i < 3 ? "1px solid #F0E8DD" : "none",
                }}
              >
                <p className="text-xs mb-1.5" style={{ color: "#9A8570" }}>{m.label}</p>
                <p className="text-2xl font-semibold" style={{ color: "#2C1810" }}>{m.valor}</p>
                <p className="text-xs mt-1" style={{ color: "#B8A898" }}>{m.note}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-center mt-5" style={{ color: "#C5B8A8" }}>
          Dados inseridos manualmente · Alimentação automática via módulo Indicadores em desenvolvimento
        </p>
      </div>
    </div>
  );
}
