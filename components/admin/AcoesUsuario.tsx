"use client";

import { useState } from "react";
import { alterarPapel, removerUsuario } from "@/app/actions/admin";

const PAPEIS = [
  { value: "OPERACAO", label: "Operação" },
  { value: "LIDER",    label: "Líder" },
  { value: "GESTAO",   label: "Gestão" },
  { value: "DONO",     label: "Dono" },
];

export default function AcoesUsuario({
  userId, papelAtual, ehDono, euSou,
}: {
  userId: string; papelAtual: string; ehDono: boolean; euSou: boolean;
}) {
  const [aberto, setAberto]     = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro]         = useState("");

  if (euSou) return <span className="text-xs" style={{ color: "#B8A898" }}>você</span>;

  async function handlePapel(e: React.ChangeEvent<HTMLSelectElement>) {
    setCarregando(true);
    setErro("");
    try {
      await alterarPapel(userId, e.target.value);
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  async function handleRemover() {
    if (!confirm("Remover este usuário? Esta ação não pode ser desfeita.")) return;
    setCarregando(true);
    try {
      await removerUsuario(userId);
    } catch (err: any) {
      setErro(err.message);
      setCarregando(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        defaultValue={papelAtual}
        onChange={handlePapel}
        disabled={carregando}
        className="text-xs px-2 py-1 rounded-lg"
        style={{ border: "1px solid #E8DDD0", color: "#6B5744", backgroundColor: "#FAFAF8" }}
      >
        {PAPEIS.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>

      {ehDono && (
        <button
          onClick={handleRemover}
          disabled={carregando}
          className="text-xs px-2 py-1 rounded-lg transition-colors"
          style={{ color: "#B91C1C", border: "1px solid rgba(185,28,28,0.2)", backgroundColor: "transparent" }}
        >
          {carregando ? "..." : "Remover"}
        </button>
      )}

      {erro && <span className="text-xs" style={{ color: "#B91C1C" }}>{erro}</span>}
    </div>
  );
}
