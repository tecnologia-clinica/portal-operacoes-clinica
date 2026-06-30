"use client";

import {
  ResponsiveContainer, ComposedChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";

// Analise Estratégica + Relatorio Procedimentos (Jun = dado incompleto)
const DATA = [
  { mes: "Jan", cirurgias: 36, consultas: 28 },
  { mes: "Fev", cirurgias: 42, consultas: 24 },
  { mes: "Mar", cirurgias: 57, consultas: 25 },
  { mes: "Abr", cirurgias: 40, consultas: 21 },
  { mes: "Mai", cirurgias: 24, consultas: 20 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ backgroundColor: "#fff", border: "1px solid #E8DDD0", borderRadius: 8, padding: "8px 12px" }}>
      <p style={{ color: "#9A8570", fontSize: 11 }}>{label} 2026</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color, fontWeight: 600, fontSize: 12 }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export default function GraficoClinico() {
  return (
    <div className="bg-white rounded-xl p-4" style={{ border: "1px solid #E8DDD0" }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold" style={{ color: "#2C1810" }}>Cirurgias e Consultas</p>
          <p className="text-xs" style={{ color: "#9A8570" }}>Jan–Mai 2026 · junho com dado incompleto</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0E8DD" />
          <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9A8570" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#9A8570" }} axisLine={false} tickLine={false} domain={[0, 70]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
          <Bar dataKey="cirurgias" name="Cirurgias" fill="#C8952A" radius={[4, 4, 0, 0]} opacity={0.85} />
          <Line type="monotone" dataKey="consultas" name="Consultas" stroke="#7C5C3A" strokeWidth={2} dot={{ r: 3, fill: "#7C5C3A" }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
