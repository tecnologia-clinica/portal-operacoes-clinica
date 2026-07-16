"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { podeAdmin, podeImportar, podeAcessarOrcamentos } from "@/lib/roles";

const SETORES = [
  { nome: "Comercial", slug: "comercial" },
  { nome: "Marketing", slug: "marketing" },
  { nome: "Clínico / Cirúrgico", slug: "clinico-cirurgico" },
  { nome: "Atendimento", slug: "atendimento" },
  { nome: "Pós-operatório", slug: "pos-operatorio" },
];

export default function Sidebar({ papel }: { papel: string }) {
  const pathname = usePathname();
  const isAdmin     = podeAdmin(papel);
  const isGeral     = papel === "GERAL";
  const isDeptl     = !isAdmin && !isGeral; // FINANCEIRO/COMERCIAL/MARKETING/EXPERIENCIA

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  function cls(active: boolean) {
    return [
      "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
      active
        ? "font-medium text-amber-800 bg-amber-50"
        : "text-stone-500 hover:text-stone-800 hover:bg-stone-100",
    ].join(" ");
  }

  return (
    <aside
      className="w-60 flex-shrink-0 flex flex-col h-full"
      style={{ backgroundColor: "#F8F4EE", borderRight: "1px solid #E8DDD0" }}
    >
      {/* Logo */}
      <div className="px-5 py-6" style={{ borderBottom: "1px solid #E8DDD0" }}>
        <Image
          src="/brand/logo-preto-completo.png"
          alt="Dr. José Salim Cury"
          width={160}
          height={80}
          className="w-32 object-contain"
        />
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">

        {/* Painel — só ADMIN e GERAL */}
        {(isAdmin || isGeral) && (
          <Link href="/painel" className={cls(isActive("/painel"))}>
            <span>⊞</span> Painel Executivo
          </Link>
        )}

        {/* Indicadores — todos */}
        <Link href="/indicadores" className={cls(isActive("/indicadores"))}>
          <span>◉</span> Indicadores
        </Link>

        {/* Acompanhamento — ADMIN e GERAL */}
        {(isAdmin || isGeral) && (
          <Link href="/acompanhamento" className={cls(isActive("/acompanhamento"))}>
            <span>◫</span> Acompanhamento
          </Link>
        )}

        {/* Importar Métricas — todos exceto GERAL */}
        {podeImportar(papel) && (
          <Link href="/metricas/importar" className={cls(isActive("/metricas"))}>
            <span>↑</span> Importar Métricas
          </Link>
        )}

        {/* Orçamentos — ADMIN e COMERCIAL */}
        {podeAcessarOrcamentos(papel) && (
          <a href="/orcamentos" target="_blank" rel="noopener noreferrer" className={cls(false)}>
            <span>◈</span> Gerador de Orçamentos
          </a>
        )}

        {/* Setores e documentos — só ADMIN */}
        {isAdmin && (
          <>
            <div className="pt-4 pb-1">
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-stone-400">
                Setores
              </p>
            </div>
            {SETORES.map((s) => {
              const href = `/setores/${s.slug}`;
              return (
                <Link key={s.slug} href={href} className={cls(isActive(href))}>
                  {s.nome}
                </Link>
              );
            })}
          </>
        )}

        {/* Sistema — só ADMIN */}
        {isAdmin && (
          <>
            <div className="pt-4 pb-1">
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-stone-400">
                Sistema
              </p>
            </div>
            <Link href="/admin" className={cls(isActive("/admin"))}>
              <span>⚙</span> Admin
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
