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

// Baseado em cirurgias × ticket médio estimado (Analise Estratégica)
// Jan 36, Fev 42, Mar 57, Abr 40, Mai 24 cirurgias · Jun = estimado
const DATA = [
  { mes: "Jan", receita: 432 },
  { mes: "Fev", receita: 504 },
  { mes: "Mar", receita: 684 },
  { mes: "Abr", receita: 480 },
  { mes: "Mai", receita: 288 },
  { mes: "Jun", receita: null },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ backgroundColor: "#fff", border: "1px solid #E8DDD0", borderRadius: 8, padding: "8px 12px" }}>
      <p style={{ color: "#9A8570", fontSize: 11 }}>{label} 2026</p>
      <p style={{ color: "#2C1810", fontWeight: 600, fontSize: 13 }}>R$ {payload[0].value}k</p>
    </div>
  );
}

export default function GraficoReceita() {
  return (
    <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #E8DDD0" }}>
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold" style={{ color: "#2C1810" }}>Receita bruta mensal (estimada)</p>
          <p className="text-xs mt-0.5" style={{ color: "#9A8570" }}>R$ mil · cirurgias × ticket est. · a confirmar com financeiro</p>
        </div>
        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: "rgba(200,149,42,0.1)", color: "#9A8570" }}>est.</span>
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <AreaChart data={DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#C8952A" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#C8952A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0E8DD" />
          <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#9A8570" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#9A8570" }} axisLine={false} tickLine={false} domain={[200, 750]} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="receita" stroke="#C8952A" strokeWidth={2.5} fill="url(#goldGrad)" dot={{ r: 3, fill: "#C8952A", strokeWidth: 0 }} activeDot={{ r: 5, fill: "#C8952A" }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
