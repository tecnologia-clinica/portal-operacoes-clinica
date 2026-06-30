"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const DATA = [
  { mes: "Jan", leads: 142, consultas: 31, cirurgias: 18, receita: 198 },
  { mes: "Fev", leads: 155, consultas: 34, cirurgias: 20, receita: 215 },
  { mes: "Mar", leads: 168, consultas: 37, cirurgias: 21, receita: 228 },
  { mes: "Abr", leads: 172, consultas: 36, cirurgias: 19, receita: 204 },
  { mes: "Mai", leads: 181, consultas: 40, cirurgias: 23, receita: 241 },
  { mes: "Jun", leads: 187, consultas: 43, cirurgias: 22, receita: 247 },
];

const TOOLTIP_STYLE = {
  backgroundColor: "#fff",
  border: "1px solid #E8DDD0",
  borderRadius: 8,
  fontSize: 12,
  color: "#2C1810",
};

export default function GraficoEvolucao() {
  return (
    <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #E8DDD0" }}>
      <div className="mb-4">
        <p className="text-sm font-semibold" style={{ color: "#2C1810" }}>Evolução mensal</p>
        <p className="text-xs mt-0.5" style={{ color: "#9A8570" }}>Janeiro — Junho 2026</p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={DATA} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0E8DD" />
          <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9A8570" }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#9A8570" }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#9A8570" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
          <Bar yAxisId="left" dataKey="leads" name="Leads" fill="#E8DDD0" radius={[3, 3, 0, 0]} />
          <Line yAxisId="left" type="monotone" dataKey="consultas" name="Consultas" stroke="#C8952A" strokeWidth={2} dot={{ r: 3, fill: "#C8952A" }} />
          <Line yAxisId="right" type="monotone" dataKey="cirurgias" name="Cirurgias" stroke="#7C5C3A" strokeWidth={2} dot={{ r: 3, fill: "#7C5C3A" }} strokeDasharray="4 2" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
