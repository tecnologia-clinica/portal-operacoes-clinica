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

export default function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside className="w-60 flex-shrink-0 bg-[#0F172A] flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <Image
          src="/brand/logo-branco-completo.png"
          alt="Dr. José Salim Cury"
          width={160}
          height={80}
          className="w-32 object-contain"
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <Link
          href="/painel"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive("/painel")
              ? "bg-white/10 text-white"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <span>⊞</span> Painel Executivo
        </Link>

        <div className="pt-4 pb-1">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Setores
          </p>
        </div>

        {SETORES.map((s) => {
          const href = `/setores/${s.slug}`;
          return (
            <Link
              key={s.slug}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive(href)
                  ? "bg-white/10 text-white font-medium"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {s.nome}
            </Link>
          );
        })}

        <div className="pt-4 pb-1">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Sistema
          </p>
        </div>

        <Link
          href="/admin"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
            isActive("/admin")
              ? "bg-white/10 text-white font-medium"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <span>⚙</span> Admin
        </Link>
      </nav>
    </aside>
  );
}
