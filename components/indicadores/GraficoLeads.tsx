"use client";

import {
  ResponsiveContainer, ComposedChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

const DATA = [
  { mes: "Jan", leads: 757  },
  { mes: "Fev", leads: 1207 },
  { mes: "Mar", leads: 933  },
  { mes: "Abr", leads: 1234 },
  { mes: "Mai", leads: 1152 },
  { mes: "Jun", leads: 726  },
];

const META_MES = 1000;

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const leads = payload[0]?.value;
  const pct = leads ? Math.round((leads / META_MES) * 100) : 0;
  return (
    <div style={{ backgroundColor: "#fff", border: "1px solid #E8DDD0", borderRadius: 8, padding: "8px 12px" }}>
      <p style={{ color: "#9A8570", fontSize: 11 }}>{label} 2026</p>
      <p style={{ color: "#2C1810", fontWeight: 600, fontSize: 13 }}>{leads?.toLocaleString("pt-BR")} leads</p>
      <p style={{ color: pct >= 100 ? "#15803D" : "#C8952A", fontSize: 11 }}>{pct}% da meta ({META_MES.toLocaleString("pt-BR")})</p>
    </div>
  );
}

export default function GraficoLeads() {
  return (
    <div className="bg-white rounded-xl p-4" style={{ border: "1px solid #E8DDD0" }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold" style={{ color: "#2C1810" }}>Leads por mês</p>
          <p className="text-xs" style={{ color: "#9A8570" }}>Jan–Jun 2026 · fonte: Kommo CRM</p>
        </div>
        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: "rgba(200,149,42,0.1)", color: "#A67A1E" }}>
          Meta: 1.000/mês
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0E8DD" />
          <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9A8570" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#9A8570" }} axisLine={false} tickLine={false} domain={[0, 1400]} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="leads" name="Leads" fill="#C8952A" radius={[4, 4, 0, 0]} opacity={0.85} />
          <Line
            type="monotone"
            dataKey={() => META_MES}
            name="Meta"
            stroke="#E8DDD0"
            strokeWidth={1.5}
            strokeDasharray="5 3"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
