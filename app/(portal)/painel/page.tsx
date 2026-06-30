import { Suspense } from "react";
import GraficoEvolucao from "@/components/painel/GraficoEvolucao";
import GraficoReceita from "@/components/painel/GraficoReceita";
import DonutMeta from "@/components/painel/DonutMeta";

const METRICAS_RAPIDAS = [
  { label: "CAC médio",              valor: "R$ 485",  icon: "◎" },
  { label: "Conv. consulta→cirurgia",valor: "51%",     icon: "⟶" },
  { label: "Ocupação agenda",        valor: "74%",     icon: "▦" },
  { label: "NPS",                    valor: "72",      icon: "★" },
  { label: "Cancelamentos",          valor: "3",       icon: "✕" },
  { label: "Retornos pós-op",        valor: "18 / 22", icon: "↩" },
];

export default function PainelPage() {
  return (
    <div className="space-y-5">

      {/* ── Cabeçalho ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#2C1810" }}>Painel Executivo</h1>
          <p className="text-sm mt-0.5" style={{ color: "#9A8570" }}>Junho 2026 — visão consolidada</p>
        </div>
        <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(200,149,42,0.12)", color: "#A67A1E" }}>
          Junho 2026
        </span>
      </div>

      {/* ── KPI cards ── */}
      <div className="grid grid-cols-4 gap-4">

        {/* Card destaque — Receita */}
        <div
          className="rounded-2xl p-5 flex flex-col justify-between row-span-1"
          style={{ backgroundColor: "#1A0E06", border: "1px solid rgba(200,149,42,0.25)", minHeight: 148 }}
        >
          <div className="flex items-start justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#6B5030" }}>
              Receita bruta
            </p>
            <span className="text-lg" style={{ color: "#C8952A" }}>$</span>
          </div>
          <div>
            <p className="text-4xl font-bold tracking-tight leading-none mt-3" style={{ color: "#F0E6D8" }}>
              R$ 247k
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ color: "#4ADE80", backgroundColor: "rgba(74,222,128,0.12)" }}>
                ▲ 2.5%
              </span>
              <span className="text-xs" style={{ color: "#5C4030" }}>vs maio</span>
            </div>
            <p className="text-xs mt-2" style={{ color: "#4A3020" }}>Meta: R$ 260k · 95% atingido</p>
          </div>
        </div>

        {/* Leads */}
        <KPICard label="Leads recebidos" valor="187" delta={3.3} sub="Tráfego pago + orgânico" icon="◈" />

        {/* Consultas */}
        <KPICard label="Consultas agendadas" valor="43" delta={7.5} sub="23% de conversão lead→consulta" icon="◷" />

        {/* Cirurgias */}
        <KPICard label="Cirurgias realizadas" valor="22" delta={-4.3} sub="Ticket médio R$ 11.227" icon="✦" />
      </div>

      {/* ── Linha principal: gráfico + painel direito ── */}
      <div className="grid grid-cols-3 gap-4">

        {/* Gráfico de evolução */}
        <div className="col-span-2">
          <Suspense fallback={<PlaceholderCard h={320} />}>
            <GraficoEvolucao />
          </Suspense>
        </div>

        {/* Painel direito: donut + métricas rápidas */}
        <div className="flex flex-col gap-4">
          <Suspense fallback={<PlaceholderCard h={260} />}>
            <DonutMeta />
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
        <GraficoReceita />
      </Suspense>
    </div>
  );
}

/* ── Componentes locais ── */

function KPICard({ label, valor, delta, sub, icon }: {
  label: string; valor: string; delta: number; sub: string; icon: string;
}) {
  const pos = delta >= 0;
  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col justify-between" style={{ border: "1px solid #E8DDD0", minHeight: 148 }}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#9A8570" }}>{label}</p>
        <span className="text-base" style={{ color: "#C8952A" }}>{icon}</span>
      </div>
      <div>
        <p className="text-4xl font-bold tracking-tight leading-none mt-3" style={{ color: "#2C1810" }}>{valor}</p>
        <div className="flex items-center gap-2 mt-3">
          <span
            className="text-xs font-semibold px-1.5 py-0.5 rounded"
            style={{ color: pos ? "#15803D" : "#B91C1C", backgroundColor: pos ? "rgba(21,128,61,0.08)" : "rgba(185,28,28,0.08)" }}
          >
            {pos ? "▲" : "▼"} {Math.abs(delta)}%
          </span>
          <span className="text-xs" style={{ color: "#9A8570" }}>vs maio</span>
        </div>
        <p className="text-xs mt-2" style={{ color: "#B8A898" }}>{sub}</p>
      </div>
    </div>
  );
}

function PlaceholderCard({ h }: { h: number }) {
  return <div className="bg-white rounded-2xl" style={{ border: "1px solid #E8DDD0", height: h }} />;
}
