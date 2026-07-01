import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import FormNovoUsuario from "@/components/admin/FormNovoUsuario";
import AcoesUsuario from "@/components/admin/AcoesUsuario";

const PAPEL_LABEL: Record<string, string> = {
  DONO: "Dono",
  GESTAO: "Gestão",
  LIDER: "Líder",
  OPERACAO: "Operação",
};

export default async function AdminPage() {
  const session = await auth();
  const papel   = (session?.user as any)?.papel as string;
  const meuId   = session?.user?.id;
  if (papel !== "DONO" && papel !== "GESTAO") redirect("/painel");

  const [usuarios, setores] = await Promise.all([
    db.usuario.findMany({
      include: { setor: { select: { nome: true } } },
      orderBy: { criadoEm: "asc" },
    }),
    db.setor.findMany({ orderBy: { nome: "asc" } }),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold" style={{ color: "#2C1810" }}>Administração</h1>
        <p className="text-sm mt-0.5" style={{ color: "#9A8570" }}>Usuários e configurações do portal</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
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
          <p className="text-3xl font-semibold" style={{ color: "#2C1810" }}>1.0</p>
        </div>
      </div>

      {/* Formulário novo usuário */}
      <FormNovoUsuario setores={setores} />

      {/* Tabela de usuários */}
      <div className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #E8DDD0" }}>
        <div className="px-5 py-4" style={{ borderBottom: "1px solid #F0E8DD" }}>
          <h2 className="text-sm font-semibold" style={{ color: "#2C1810" }}>Usuários do portal</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "#FBF8F4" }}>
              <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wide" style={{ color: "#9A8570" }}>Nome</th>
              <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide" style={{ color: "#9A8570" }}>Email</th>
              <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide" style={{ color: "#9A8570" }}>Setor</th>
              <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide" style={{ color: "#9A8570" }}>Desde</th>
              <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide" style={{ color: "#9A8570" }}>Perfil / Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} style={{ borderTop: "1px solid #F7F3EE" }}>
                <td className="px-5 py-3.5 font-medium" style={{ color: "#2C1810" }}>{u.nome}</td>
                <td className="px-4 py-3.5" style={{ color: "#9A8570" }}>{u.email}</td>
                <td className="px-4 py-3.5" style={{ color: "#9A8570" }}>{u.setor?.nome ?? "—"}</td>
                <td className="px-4 py-3.5" style={{ color: "#9A8570" }}>
                  {new Date(u.criadoEm).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-3.5">
                  <AcoesUsuario
                    userId={u.id}
                    papelAtual={u.papel}
                    ehDono={papel === "DONO"}
                    euSou={u.id === meuId}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
