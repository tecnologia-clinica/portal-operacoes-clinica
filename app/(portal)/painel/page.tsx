import { Suspense } from "react";
import GraficoEvolucao from "@/components/painel/GraficoEvolucao";
import GraficoReceita from "@/components/painel/GraficoReceita";

interface KPI {
  label: string;
  valor: string;
  delta: number;
  deltaLabel: string;
  sub?: string;
}

const KPIS: KPI[] = [
  {
    label: "Leads recebidos",
    valor: "187",
    delta: 3.3,
    deltaLabel: "vs maio",
    sub: "Tráfego pago + orgânico",
  },
  {
    label: "Consultas agendadas",
    valor: "43",
    delta: 7.5,
    deltaLabel: "vs maio",
    sub: "23% de conversão lead→consulta",
  },
  {
    label: "Cirurgias realizadas",
    valor: "22",
    delta: -4.3,
    deltaLabel: "vs maio",
    sub: "Ticket médio R$ 11.227",
  },
  {
    label: "Receita bruta",
    valor: "R$ 247k",
    delta: 2.5,
    deltaLabel: "vs maio",
    sub: "Meta: R$ 260k",
  },
];

const METRICAS = [
  { label: "CAC médio", valor: "R$ 485", note: "por lead qualificado" },
  { label: "Taxa consulta→cirurgia", valor: "51%", note: "22 de 43 consultas" },
  { label: "Ocupação da agenda", valor: "74%", note: "slots preenchidos" },
  { label: "NPS", valor: "72", note: "Promotores: 68%" },
  { label: "Cirurgias canceladas", valor: "3", note: "13,6% do agendado" },
  { label: "Retornos pós-op", valor: "18", note: "de 22 cirurgias" },
];

function KPICard({ kpi }: { kpi: KPI }) {
  const positivo = kpi.delta >= 0;
  return (
    <div className="bg-white rounded-xl p-5" style={{ border: "1px solid #E8DDD0" }}>
      <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: "#9A8570" }}>
        {kpi.label}
      </p>
      <p className="text-3xl font-semibold tracking-tight mb-1" style={{ color: "#2C1810" }}>
        {kpi.valor}
      </p>
      <div className="flex items-center gap-1.5 mb-2">
        <span
          className="text-xs font-medium"
          style={{ color: positivo ? "#15803D" : "#B91C1C" }}
        >
          {positivo ? "▲" : "▼"} {Math.abs(kpi.delta)}%
        </span>
        <span className="text-xs" style={{ color: "#9A8570" }}>{kpi.deltaLabel}</span>
      </div>
      {kpi.sub && (
        <p className="text-xs" style={{ color: "#B8A898" }}>{kpi.sub}</p>
      )}
    </div>
  );
}

export default function PainelPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#2C1810" }}>Painel Executivo</h1>
          <p className="text-sm mt-0.5" style={{ color: "#9A8570" }}>Junho 2026 — visão consolidada</p>
        </div>
        <span
          className="px-3 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: "rgba(200,149,42,0.1)", color: "#A67A1E" }}
        >
          Atualizado manualmente
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {KPIS.map((k) => <KPICard key={k.label} kpi={k} />)}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Suspense fallback={<div className="bg-white rounded-xl h-[320px]" style={{ border: "1px solid #E8DDD0" }} />}>
            <GraficoEvolucao />
          </Suspense>
        </div>
        <div className="space-y-4">
          <Suspense fallback={<div className="bg-white rounded-xl h-[180px]" style={{ border: "1px solid #E8DDD0" }} />}>
            <GraficoReceita />
          </Suspense>

          {/* Meta do mês */}
          <div className="bg-white rounded-xl p-5" style={{ border: "1px solid #E8DDD0" }}>
            <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: "#9A8570" }}>
              Meta receita junho
            </p>
            <div className="flex items-end justify-between mb-2">
              <span className="text-xl font-semibold" style={{ color: "#2C1810" }}>R$ 247k</span>
              <span className="text-xs" style={{ color: "#9A8570" }}>de R$ 260k</span>
            </div>
            <div className="w-full rounded-full h-2" style={{ backgroundColor: "#F0E8DD" }}>
              <div
                className="h-2 rounded-full"
                style={{ width: "95%", backgroundColor: "#C8952A" }}
              />
            </div>
            <p className="text-xs mt-1.5" style={{ color: "#9A8570" }}>95% da meta atingida</p>
          </div>
        </div>
      </div>

      {/* Métricas secundárias */}
      <div className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #E8DDD0" }}>
        <div className="px-5 py-4" style={{ borderBottom: "1px solid #F0E8DD" }}>
          <p className="text-sm font-semibold" style={{ color: "#2C1810" }}>Indicadores detalhados — Junho 2026</p>
        </div>
        <div className="grid grid-cols-3 divide-x divide-y" style={{ borderColor: "#F0E8DD" }}>
          {METRICAS.map((m) => (
            <div key={m.label} className="px-5 py-4">
              <p className="text-xs mb-1" style={{ color: "#9A8570" }}>{m.label}</p>
              <p className="text-xl font-semibold" style={{ color: "#2C1810" }}>{m.valor}</p>
              <p className="text-xs mt-0.5" style={{ color: "#B8A898" }}>{m.note}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-center pb-2" style={{ color: "#C5B8A8" }}>
        Dados inseridos manualmente · Alimentação automática via módulo Indicadores em desenvolvimento
      </p>
    </div>
  );
}
