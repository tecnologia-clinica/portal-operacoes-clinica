"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TIPOS = ["POP", "POLITICA", "JD"] as const;

export default function FormDocumento({
  setorId,
  setorSlug,
  inicial,
  docId,
}: {
  setorId: string;
  setorSlug: string;
  inicial?: { titulo: string; tipo: string; conteudoMd: string; dataRevisao?: string };
  docId?: string;
}) {
  const router = useRouter();
  const [titulo, setTitulo] = useState(inicial?.titulo ?? "");
  const [tipo, setTipo] = useState(inicial?.tipo ?? "POP");
  const [conteudo, setConteudo] = useState(inicial?.conteudoMd ?? "");
  const [dataRevisao, setDataRevisao] = useState(inicial?.dataRevisao ?? "");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setSalvando(true);

    const url = docId ? `/api/documentos/${docId}` : "/api/documentos";
    const method = docId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, setorId, tipo, conteudoMd: conteudo, dataRevisao: dataRevisao || null }),
    });

    setSalvando(false);

    if (!res.ok) {
      setErro("Erro ao salvar. Tente novamente.");
      return;
    }

    router.push(`/setores/${setorSlug}/documentos`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: POP de Atendimento ao Lead"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {TIPOS.map((t) => (
            <option key={t} value={t}>{t === "JD" ? "Job Description (JD)" : t}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Data de revisão</label>
        <input
          type="date"
          value={dataRevisao}
          onChange={(e) => setDataRevisao(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Conteúdo (Markdown)</label>
        <textarea
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          rows={16}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          placeholder="# Título do POP&#10;&#10;## Objetivo&#10;..."
        />
      </div>

      {erro && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{erro}</p>}

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={salvando}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {salvando ? "Salvando..." : docId ? "Salvar alterações" : "Criar documento"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 text-sm font-medium rounded-lg transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
