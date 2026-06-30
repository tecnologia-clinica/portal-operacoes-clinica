import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const PAPEL_LABEL: Record<string, string> = {
  DONO: "Dono",
  GESTAO: "Gestão",
  LIDER: "Líder",
  OPERACAO: "Operação",
};

export default async function AdminPage() {
  const session = await auth();
  const papel = (session?.user as any)?.papel;
  if (papel !== "DONO" && papel !== "GESTAO") redirect("/painel");

  const usuarios = await db.usuario.findMany({
    include: { setor: { select: { nome: true } } },
    orderBy: { criadoEm: "asc" },
  });

  const setores = await db.setor.findMany({ orderBy: { nome: "asc" } });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold" style={{ color: "#2C1810" }}>Administração</h1>
        <p className="text-sm mt-0.5" style={{ color: "#9A8570" }}>Usuários e configurações do portal</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5" style={{ border: "1px solid #E8DDD0" }}>
          <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: "#9A8570" }}>Usuários</p>
          <p className="text-3xl font-semibold" style={{ color: "#2C1810" }}>{usuarios.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5" style={{ border: "1px solid #E8DDD0" }}>
          <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: "#9A8570" }}>Setores</p>
          <p className="text-3xl font-semibold" style={{ color: "#2C1810" }}>{setores.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5" style={{ border: "1px solid #E8DDD0" }}>
          <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: "#9A8570" }}>Versão</p>
          <p className="text-3xl font-semibold" style={{ color: "#2C1810" }}>0.1</p>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #E8DDD0" }}>
        <div className="px-5 py-4" style={{ borderBottom: "1px solid #F0E8DD" }}>
          <h2 className="text-sm font-semibold" style={{ color: "#2C1810" }}>Usuários do portal</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "#FBF8F4" }}>
              <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wide" style={{ color: "#9A8570" }}>Nome</th>
              <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide" style={{ color: "#9A8570" }}>Email</th>
              <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide" style={{ color: "#9A8570" }}>Perfil</th>
              <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide" style={{ color: "#9A8570" }}>Setor</th>
              <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide" style={{ color: "#9A8570" }}>Desde</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} style={{ borderTop: "1px solid #F7F3EE" }}>
                <td className="px-5 py-3.5 font-medium" style={{ color: "#2C1810" }}>{u.nome}</td>
                <td className="px-4 py-3.5" style={{ color: "#9A8570" }}>{u.email}</td>
                <td className="px-4 py-3.5">
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={
                      u.papel === "DONO"
                        ? { backgroundColor: "rgba(200,149,42,0.12)", color: "#A67A1E" }
                        : { backgroundColor: "#F7F3EE", color: "#6B5744" }
                    }
                  >
                    {PAPEL_LABEL[u.papel]}
                  </span>
                </td>
                <td className="px-4 py-3.5" style={{ color: "#9A8570" }}>{u.setor?.nome ?? "—"}</td>
                <td className="px-4 py-3.5" style={{ color: "#9A8570" }}>
                  {new Date(u.criadoEm).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
