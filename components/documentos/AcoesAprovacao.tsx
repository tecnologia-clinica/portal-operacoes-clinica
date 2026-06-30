"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AcoesAprovacao({
  docId,
  setorSlug,
  modo = "aprovar",
}: {
  docId: string;
  setorSlug: string;
  modo?: "aprovar" | "submeter";
}) {
  const router = useRouter();
  const [comentario, setComentario] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function executar(acao: string) {
    setCarregando(true);
    await fetch(`/api/documentos/${docId}/aprovar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ acao, comentario }),
    });
    setCarregando(false);
    router.refresh();
  }

  if (modo === "submeter") {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm font-medium text-blue-800 mb-3">Enviar para aprovação</p>
        <button
          onClick={() => executar("SOLICITAR_REVISAO")}
          disabled={carregando}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {carregando ? "Enviando..." : "Enviar para revisão"}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
      <p className="text-sm font-medium text-amber-800 mb-3">Documento aguardando aprovação</p>
      <textarea
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        placeholder="Comentário (opcional)"
        rows={2}
        className="w-full px-3 py-2 border border-amber-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white mb-3 resize-none"
      />
      <div className="flex gap-2">
        <button
          onClick={() => executar("APROVAR")}
          disabled={carregando}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {carregando ? "..." : "✓ Aprovar"}
        </button>
        <button
          onClick={() => executar("SOLICITAR_REVISAO")}
          disabled={carregando}
          className="px-4 py-2 border border-amber-400 text-amber-700 hover:bg-amber-100 disabled:opacity-60 text-sm font-medium rounded-lg transition-colors"
        >
          Solicitar revisão
        </button>
      </div>
    </div>
  );
}
