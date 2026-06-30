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

const DATA = [
  { mes: "Jan", receita: 198 },
  { mes: "Fev", receita: 215 },
  { mes: "Mar", receita: 228 },
  { mes: "Abr", receita: 204 },
  { mes: "Mai", receita: 241 },
  { mes: "Jun", receita: 247 },
];

const TOOLTIP_STYLE = {
  backgroundColor: "#fff",
  border: "1px solid #E8DDD0",
  borderRadius: 8,
  fontSize: 12,
  color: "#2C1810",
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ ...TOOLTIP_STYLE, padding: "8px 12px" }}>
      <p style={{ color: "#9A8570", fontSize: 11 }}>{label} 2026</p>
      <p style={{ color: "#2C1810", fontWeight: 600 }}>
        R$ {payload[0].value.toFixed(0)}k
      </p>
    </div>
  );
}

export default function GraficoReceita() {
  return (
    <div className="bg-white rounded-xl p-5" style={{ border: "1px solid #E8DDD0" }}>
      <div className="mb-4">
        <p className="text-sm font-semibold" style={{ color: "#2C1810" }}>Receita bruta</p>
        <p className="text-xs mt-0.5" style={{ color: "#9A8570" }}>R$ mil · Jan — Jun 2026</p>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={DATA} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C8952A" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#C8952A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0E8DD" />
          <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#9A8570" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#9A8570" }} axisLine={false} tickLine={false} domain={[180, 260]} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="receita" stroke="#C8952A" strokeWidth={2} fill="url(#goldGrad)" dot={{ r: 3, fill: "#C8952A" }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
