"use client";

import { signOut } from "next-auth/react";

const PAPEL_LABEL: Record<string, string> = {
  ADMIN:      "Admin",
  FINANCEIRO: "Financeiro",
  COMERCIAL:  "Comercial",
  MARKETING:  "Marketing",
  EXPERIENCIA:"Experiência",
  GERAL:      "Geral",
};

export default function Topbar({ user, onMenuClick }: { user: any; onMenuClick: () => void }) {
  return (
    <header
      className="h-14 bg-white flex items-center justify-between px-4 md:px-6 flex-shrink-0 relative z-50"
      style={{ borderBottom: "1px solid #E8DDD0" }}
    >
      <button
        onClick={onMenuClick}
        aria-label="Abrir menu"
        className="md:hidden p-1.5 -ml-1.5 rounded-lg"
        style={{ color: "#6B5744" }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <div className="hidden md:block" />
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
