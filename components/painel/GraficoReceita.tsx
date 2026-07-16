"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export type PontoReceita = { mes: string; receita: number | null };

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ backgroundColor: "#fff", border: "1px solid #E8DDD0", borderRadius: 8, padding: "8px 12px" }}>
      <p style={{ color: "#9A8570", fontSize: 11 }}>{label}</p>
      <p style={{ color: "#2C1810", fontWeight: 600, fontSize: 13 }}>R$ {payload[0].value}k</p>
    </div>
  );
}

export default function GraficoReceita({
  serie, subtitulo, badge,
}: {
  serie: PontoReceita[]; subtitulo: string; badge: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #E8DDD0" }}>
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold" style={{ color: "#2C1810" }}>Receita bruta mensal</p>
          <p className="text-xs mt-0.5" style={{ color: "#9A8570" }}>{subtitulo}</p>
        </div>
        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: "rgba(200,149,42,0.1)", color: "#9A8570" }}>{badge}</span>
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <AreaChart data={serie} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#C8952A" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#C8952A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0E8DD" />
          <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#9A8570" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#9A8570" }} axisLine={false} tickLine={false} domain={[0, "auto"]} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="receita" stroke="#C8952A" strokeWidth={2.5} fill="url(#goldGrad)" dot={{ r: 3, fill: "#C8952A", strokeWidth: 0 }} activeDot={{ r: 5, fill: "#C8952A" }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
