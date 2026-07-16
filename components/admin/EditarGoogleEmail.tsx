"use client";

import { useState } from "react";
import { definirGoogleEmail } from "@/app/actions/admin";

export default function EditarGoogleEmail({ userId, valorAtual }: { userId: string; valorAtual: string | null }) {
  const [editando, setEditando] = useState(false);
  const [valor, setValor]       = useState(valorAtual ?? "");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro]         = useState("");

  async function salvar() {
    setSalvando(true);
    setErro("");
    try {
      await definirGoogleEmail(userId, valor);
      setEditando(false);
    } catch (e: any) {
      setErro(e.message ?? "Erro ao salvar");
    } finally {
      setSalvando(false);
    }
  }

  if (!editando) {
    return (
      <button
        onClick={() => setEditando(true)}
        className="text-xs hover:opacity-70 transition-opacity"
        style={{ color: valorAtual ? "#2C1810" : "#B8A898" }}
      >
        {valorAtual ?? "— definir —"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="email"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        placeholder="nome@gmail.com"
        disabled={salvando}
        className="text-xs px-2 py-1 rounded-lg w-40"
        style={{ border: "1px solid #E8DDD0", color: "#2C1810", backgroundColor: "#FAFAF8" }}
      />
      <button
        onClick={salvar}
        disabled={salvando}
        className="text-xs px-2 py-1 rounded-lg font-medium"
        style={{ backgroundColor: "#C8952A", color: "#fff" }}
      >
        {salvando ? "..." : "Salvar"}
      </button>
      <button
        onClick={() => { setEditando(false); setValor(valorAtual ?? ""); setErro(""); }}
        className="text-xs"
        style={{ color: "#9A8570" }}
      >
        Cancelar
      </button>
      {erro && <span className="text-xs" style={{ color: "#B91C1C" }}>{erro}</span>}
    </div>
  );
}
