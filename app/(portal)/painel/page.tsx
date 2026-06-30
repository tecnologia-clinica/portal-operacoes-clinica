import { Suspense } from "react";
import GraficoEvolucao from "@/components/painel/GraficoEvolucao";
import GraficoReceita from "@/components/painel/GraficoReceita";
import DonutMeta from "@/components/painel/DonutMeta";

// Fonte: Diagnóstico Comercial, Kommo 30/06, Dr José Cury Maio26 (ads)
const METRICAS_RAPIDAS = [
  { label: "Conv. lead→cirurgia",    valor: "0.53%",   icon: "⟶" },
  { label: "CAC ads (mai)",          valor: "~R$ 730", icon: "◎" },
  { label: "Lead frio (jun)",        valor: "64%",     icon: "▦" },
  { label: "Resp. média (jun)",      valor: "4 min",   icon: "★" },
  { label: "Cancelados (jun)",       valor: "50",      icon: "✕" },
  { label: "Leads quentes (jun)",    valor: "3",       icon: "↩" },
];

export default function PainelPage() {
  return (
    <div className="space-y-5">

      {/* ── Cabeçalho ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#2C1810" }}>Painel Executivo</h1>
          <p className="text-sm mt-0.5" style={{ color: "#9A8570" }}>Junho 2026 · leads completo · clínico parcial</p>
        </div>
        <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(200,149,42,0.12)", color: "#A67A1E" }}>
          Junho 2026
        </span>
      </div>

      {/* ── KPI cards ── */}
      <div className="grid grid-cols-4 gap-4">

        {/* Card destaque — Leads junho (dado completo via Kommo 30/06) */}
        <div
          className="rounded-2xl p-5 flex flex-col justify-between row-span-1"
          style={{
            background: "linear-gradient(135deg, #C8952A 0%, #A67520 60%, #7C5518 100%)",
            minHeight: 148,
          }}
        >
          <div className="flex items-start justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.6)" }}>
              Leads — Junho
            </p>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)" }}>
              completo
            </span>
          </div>
          <div>
            <p className="text-4xl font-bold tracking-tight leading-none mt-3" style={{ color: "#fff" }}>
              726
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ color: "#fff", backgroundColor: "rgba(0,0,0,0.2)" }}>
                ▼ 37% vs mai
              </span>
            </div>
            <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.55)" }}>0.53% conv. lead→cirurgia · Kommo 30/06</p>
          </div>
        </div>

        {/* Cirurgias — maio (dado de junho incompleto) */}
        <KPICard label="Cirurgias — Maio" valor="24" delta={-40} sub="Jun incompleto · pico: Mar (57)" icon="✦" />

        {/* Consultas — maio (dado de junho incompleto) */}
        <KPICard label="Consultas — Maio" valor="20" delta={-4.8} sub="Jun incompleto · procedimentos CSV" icon="◷" />

        {/* Receita estimada */}
        <KPICard label="Receita (est.)" valor="R$ 288k" delta={-15} sub="24 cirurg. × ticket est. · a confirmar" icon="$" />
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
