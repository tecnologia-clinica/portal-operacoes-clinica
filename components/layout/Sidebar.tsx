"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const SETORES = [
  { nome: "Comercial", slug: "comercial" },
  { nome: "Marketing", slug: "marketing" },
  { nome: "Clínico / Cirúrgico", slug: "clinico-cirurgico" },
  { nome: "Atendimento", slug: "atendimento" },
  { nome: "Pós-operatório", slug: "pos-operatorio" },
];

const GOLD = "#C8952A";
const GOLD_HOVER_BG = "rgba(200,149,42,0.08)";
const GOLD_ACTIVE_BG = "rgba(200,149,42,0.15)";

export default function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  function linkStyle(active: boolean) {
    return active
      ? { backgroundColor: GOLD_ACTIVE_BG, color: GOLD, fontWeight: 500 }
      : { color: "#9A8570" };
  }

  function hoverIn(e: React.MouseEvent, active: boolean) {
    if (!active) {
      (e.currentTarget as HTMLElement).style.color = GOLD;
      (e.currentTarget as HTMLElement).style.backgroundColor = GOLD_HOVER_BG;
    }
  }

  function hoverOut(e: React.MouseEvent, active: boolean) {
    if (!active) {
      (e.currentTarget as HTMLElement).style.color = "#9A8570";
      (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
    }
  }

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col h-full" style={{ backgroundColor: "#1A0E06" }}>
      <div className="px-5 py-6" style={{ borderBottom: "1px solid rgba(200,149,42,0.2)" }}>
        <Image
          src="/brand/logo-dourado-completo.png"
          alt="Dr. José Salim Cury"
          width={160}
          height={80}
          className="w-32 object-contain"
        />
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {(() => {
          const active = isActive("/painel");
          return (
            <Link
              href="/painel"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors"
              style={linkStyle(active)}
              onMouseEnter={(e) => hoverIn(e, active)}
              onMouseLeave={(e) => hoverOut(e, active)}
            >
              <span>⊞</span> Painel Executivo
            </Link>
          );
        })()}

        <div className="pt-4 pb-1">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#5C4A36" }}>
            Setores
          </p>
        </div>

        {SETORES.map((s) => {
          const href = `/setores/${s.slug}`;
          const active = isActive(href);
          return (
            <Link
              key={s.slug}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors"
              style={linkStyle(active)}
              onMouseEnter={(e) => hoverIn(e, active)}
              onMouseLeave={(e) => hoverOut(e, active)}
            >
              {s.nome}
            </Link>
          );
        })}

        <div className="pt-4 pb-1">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#5C4A36" }}>
            Sistema
          </p>
        </div>

        {(() => {
          const active = isActive("/admin");
          return (
            <Link
              href="/admin"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors"
              style={linkStyle(active)}
              onMouseEnter={(e) => hoverIn(e, active)}
              onMouseLeave={(e) => hoverOut(e, active)}
            >
              <span>⚙</span> Admin
            </Link>
          );
        })()}
      </nav>
    </aside>
  );
}
