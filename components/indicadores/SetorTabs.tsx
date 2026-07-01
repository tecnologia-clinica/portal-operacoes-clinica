"use client";

import { useRouter, useSearchParams } from "next/navigation";

const TABS = [
  { id: "geral",            label: "Visão Geral" },
  { id: "comercial",        label: "Comercial" },
  { id: "marketing",        label: "Marketing" },
  { id: "clinico",          label: "Clínico" },
  { id: "atendimento",      label: "Atendimento" },
  { id: "experiencia",      label: "Exp. Cliente" },
  { id: "financeiro",       label: "Financeiro" },
];

export default function SetorTabs({ ativo }: { ativo: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function navegar(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", id);
    router.push(`/indicadores?${params.toString()}`);
  }

  return (
    <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: "#F0E8DD" }}>
      {TABS.map((t) => {
        const ativo_ = t.id === ativo;
        return (
          <button
            key={t.id}
            onClick={() => navegar(t.id)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              backgroundColor: ativo_ ? "#fff" : "transparent",
              color: ativo_ ? "#2C1810" : "#9A8570",
              boxShadow: ativo_ ? "0 1px 3px rgba(44,24,16,0.08)" : "none",
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
