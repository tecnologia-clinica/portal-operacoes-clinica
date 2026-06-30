"use client";

import { signOut } from "next-auth/react";

const PAPEL_LABEL: Record<string, string> = {
  DONO: "Dono",
  GESTAO: "Gestão",
  LIDER: "Líder",
  OPERACAO: "Operação",
};

export default function Topbar({ user }: { user: any }) {
  return (
    <header
      className="h-14 bg-white flex items-center justify-between px-6 flex-shrink-0"
      style={{ borderBottom: "1px solid #E8DDD0" }}
    >
      <div />
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium leading-none" style={{ color: "#2C1810" }}>
            {user?.name}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#C8952A" }}>
            {PAPEL_LABEL[user?.papel] ?? user?.papel}
          </p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-xs px-2 py-1 rounded transition-colors"
          style={{ color: "#9A8570" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#2C1810";
            (e.currentTarget as HTMLElement).style.backgroundColor = "#F7F3EE";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#9A8570";
            (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
          }}
        >
          Sair
        </button>
      </div>
    </header>
  );
}
