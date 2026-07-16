"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function DonutMeta({ realizado, meta }: { realizado: number; meta: number }) {
  const pct = meta > 0 ? Math.round((realizado / meta) * 100) : 0;
  const restante = Math.max(meta - realizado, 0);
  const DATA = [
    { value: realizado },
    { value: restante },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col" style={{ border: "1px solid #E8DDD0" }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#9A8570" }}>
        Receita vs meta
      </p>
      <p className="text-xs mb-3" style={{ color: "#B8A898" }}>R$ {realizado}k de R$ {meta}k</p>

      <div className="relative flex items-center justify-center" style={{ height: 148 }}>
        <ResponsiveContainer width="100%" height={148}>
          <PieChart>
            <Pie
              data={DATA}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={64}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              strokeWidth={0}
            >
              <Cell fill="#C8952A" />
              <Cell fill="#F0E8DD" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-semibold" style={{ color: "#2C1810" }}>{pct}%</span>
          <span className="text-xs mt-0.5" style={{ color: "#9A8570" }}>atingido</span>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex justify-between text-xs">
          <span style={{ color: "#9A8570" }}>Realizado</span>
          <span className="font-semibold" style={{ color: "#2C1810" }}>R$ {realizado}k</span>
        </div>
        <div className="flex justify-between text-xs">
          <span style={{ color: "#9A8570" }}>Restante</span>
          <span className="font-semibold" style={{ color: "#C8952A" }}>R$ {restante}k</span>
        </div>
      </div>
    </div>
  );
}
