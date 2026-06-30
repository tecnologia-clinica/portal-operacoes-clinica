import Link from "next/link";
import { db } from "@/lib/db";

const MESES = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];

const ANO = 2026;
const MES_ATUAL = 6; // junho

export default async function AcompanhamentoListaPage() {
  const registros = await db.acompanhamentoMensal.findMany({
    where: { ano: ANO },
    select: { mes: true, status: true, destaques: true, atualizadoEm: true },
  });

  const porMes: Record<number, typeof registros[0] | undefined> = {};
  for (const r of registros) porMes[r.mes] = r;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#2C1810" }}>Acompanhamento Mensal</h1>
          <p className="text-sm mt-0.5" style={{ color: "#9A8570" }}>{ANO} · registro executivo por mês</p>
        </div>
        <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(200,149,42,0.12)", color: "#A67A1E" }}>
          {ANO}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {MESES.map((nome, idx) => {
          const mes = idx + 1;
          const slug = `${ANO}-${String(mes).padStart(2, "0")}`;
          const reg = porMes[mes];
          const futuro = mes > MES_ATUAL;
          const atual = mes === MES_ATUAL;
          const status = reg?.status ?? null;

          const destaques = reg?.destaques as string[] | null;

          return (
            <div
              key={mes}
              className="bg-white rounded-xl overflow-hidden"
              style={{
                border: atual
                  ? "1px solid #C8952A"
                  : "1px solid #E8DDD0",
                opacity: futuro ? 0.45 : 1,
              }}
            >
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{
                  backgroundColor: atual ? "rgba(200,149,42,0.06)" : "#F7F3EE",
                  borderBottom: "1px solid #E8DDD0",
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold" style={{ color: "#2C1810" }}>{nome}</span>
                  {atual && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: "rgba(200,149,42,0.15)", color: "#A67A1E" }}>atual</span>
                  )}
                </div>
                <StatusBadge status={status} futuro={futuro} />
              </div>

              <div className="px-4 py-3">
                {destaques && destaques.length > 0 ? (
                  <ul className="space-y-1">
                    {destaques.slice(0, 2).map((d, i) => (
                      <li key={i} className="text-xs flex gap-1.5" style={{ color: "#6B5744" }}>
                        <span style={{ color: "#C8952A" }}>·</span> {d}
                      </li>
                    ))}
                    {destaques.length > 2 && (
                      <li className="text-xs" style={{ color: "#B8A898" }}>+{destaques.length - 2} destaques</li>
                    )}
                  </ul>
                ) : (
                  <p className="text-xs" style={{ color: "#B8A898" }}>
                    {futuro ? "Mês futuro" : "Sem registro ainda"}
                  </p>
                )}

                {reg?.atualizadoEm && (
                  <p className="text-xs mt-2" style={{ color: "#B8A898" }}>
                    Atualizado {new Date(reg.atualizadoEm).toLocaleDateString("pt-BR")}
                  </p>
                )}
              </div>

              {!futuro && (
                <div className="px-4 pb-3">
                  <Link
                    href={`/acompanhamento/${slug}`}
                    className="block text-center text-xs font-medium py-1.5 rounded-lg transition-colors"
                    style={{
                      backgroundColor: status ? "transparent" : "rgba(200,149,42,0.1)",
                      color: "#A67A1E",
                      border: status ? "1px solid #E8DDD0" : "none",
                    }}
                  >
                    {status ? "Ver registro" : "Preencher →"}
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatusBadge({ status, futuro }: { status: string | null; futuro: boolean }) {
  if (futuro) return null;
  if (status === "publicado") {
    return (
      <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: "rgba(21,128,61,0.08)", color: "#15803D" }}>
        ✓ publicado
      </span>
    );
  }
  if (status === "rascunho") {
    return (
      <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: "rgba(200,149,42,0.1)", color: "#A67A1E" }}>
        rascunho
      </span>
    );
  }
  return (
    <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "#F0E8DD", color: "#9A8570" }}>
      vazio
    </span>
  );
}
