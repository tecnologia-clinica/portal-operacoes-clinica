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
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
      <div />
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-800 leading-none">{user?.name}</p>
          <p className="text-xs text-slate-500 mt-0.5">{PAPEL_LABEL[user?.papel] ?? user?.papel}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-xs text-slate-400 hover:text-slate-700 transition-colors px-2 py-1 rounded hover:bg-slate-100"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
