import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import FormImportarCSV from "@/components/metricas/FormImportarCSV";

const NOME_MES = ["", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const NOME_SETOR: Record<string, string> = {
  comercial:   "Comercial",
  marketing:   "Marketing",
  clinico:     "Clínico / Cirúrgico",
  atendimento: "Atendimento",
  experiencia: "Experiência do Cliente",
};

export default async function ImportarMetricasPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const papel = (session.user as any)?.papel as string;
  if (papel === "OPERACAO") redirect("/painel");

  const historico = await db.metricaMensal.findMany({
    orderBy: [{ ano: "desc" }, { mes: "desc" }],
    include: { autor: { select: { nome: true } } },
    take: 20,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "#2C1810" }}>Importar Métricas</h1>
        <p className="text-sm mt-0.5" style={{ color: "#9A8570" }}>
          Envie um CSV com os dados mensais de cada setor
        </p>
      </div>

      {/* Instruções */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { n: "1", titulo: "Baixe o template",    desc: "Escolha o setor e o mês, depois clique em Baixar Template" },
          { n: "2", titulo: "Preencha os valores",  desc: "Abra no Excel ou Google Sheets, preencha os números e salve como .csv" },
          { n: "3", titulo: "Faça upload e confirme", desc: "Envie o arquivo, confira a prévia e clique em Importar" },
        ].map((s) => (
          <div key={s.n} className="bg-white rounded-xl p-4 flex gap-3" style={{ border: "1px solid #E8DDD0" }}>
            <span
              className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(200,149,42,0.15)", color: "#A67A1E" }}
            >
              {s.n}
            </span>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#2C1810" }}>{s.titulo}</p>
              <p className="text-xs mt-0.5" style={{ color: "#9A8570" }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Formulário */}
      <div className="bg-white rounded-xl p-6" style={{ border: "1px solid #E8DDD0" }}>
        <FormImportarCSV />
      </div>

      {/* Histórico de importações */}
      {historico.length > 0 && (
        <div className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #E8DDD0" }}>
          <div className="px-5 py-4" style={{ borderBottom: "1px solid #F0E8DD" }}>
            <h2 className="text-sm font-semibold" style={{ color: "#2C1810" }}>Histórico de importações</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#FBF8F4" }}>
                <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wide" style={{ color: "#9A8570" }}>Setor</th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide" style={{ color: "#9A8570" }}>Período</th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide" style={{ color: "#9A8570" }}>Métricas</th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide" style={{ color: "#9A8570" }}>Importado por</th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide" style={{ color: "#9A8570" }}>Data</th>
              </tr>
            </thead>
            <tbody>
              {historico.map((m) => {
                const dados = m.dados as Record<string, number | null>;
                const qtd   = Object.values(dados).filter((v) => v !== null).length;
                return (
                  <tr key={m.id} style={{ borderTop: "1px solid #F7F3EE" }}>
                    <td className="px-5 py-3 font-medium" style={{ color: "#2C1810" }}>
                      {NOME_SETOR[m.setor] ?? m.setor}
                    </td>
                    <td className="px-4 py-3" style={{ color: "#6B5744" }}>
                      {NOME_MES[m.mes]} {m.ano}
                    </td>
                    <td className="px-4 py-3" style={{ color: "#9A8570" }}>
                      {qtd} valor{qtd !== 1 ? "es" : ""}
                    </td>
                    <td className="px-4 py-3" style={{ color: "#9A8570" }}>
                      {m.autor.nome}
                    </td>
                    <td className="px-4 py-3" style={{ color: "#9A8570" }}>
                      {new Date(m.criadoEm).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
