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

export type PontoEvolucao = { mes: string; leads: number | null; consultas: number | null; cirurgias: number | null };

const TOOLTIP_STYLE = {
  backgroundColor: "#fff",
  border: "1px solid #E8DDD0",
  borderRadius: 8,
  fontSize: 12,
  color: "#2C1810",
};

export default function GraficoEvolucao({
  serie, periodoLabel, nota,
}: {
  serie: PontoEvolucao[]; periodoLabel: string; nota: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #E8DDD0" }}>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold" style={{ color: "#2C1810" }}>Evolução mensal</p>
          <p className="text-xs mt-0.5" style={{ color: "#9A8570" }}>{periodoLabel}</p>
        </div>
        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: "rgba(200,149,42,0.1)", color: "#9A8570" }}>
          {nota}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={serie} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0E8DD" />
          <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9A8570" }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#9A8570" }} axisLine={false} tickLine={false} domain={[0, "auto"]} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#9A8570" }} axisLine={false} tickLine={false} domain={[0, "auto"]} />
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
