"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TIPOS = ["POP", "POLITICA", "JD"] as const;

const inputStyle = {
  border: "1px solid #E8DDD0",
  borderRadius: "0.5rem",
  padding: "0.5rem 0.75rem",
  fontSize: "0.875rem",
  width: "100%",
  outline: "none",
  color: "#2C1810",
  backgroundColor: "#fff",
};

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
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 space-y-5" style={{ border: "1px solid #E8DDD0" }}>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "#6B5744" }}>Título</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          style={inputStyle}
          placeholder="Ex: POP de Atendimento ao Lead"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "#6B5744" }}>Tipo</label>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          style={inputStyle}
        >
          {TIPOS.map((t) => (
            <option key={t} value={t}>{t === "JD" ? "Job Description (JD)" : t}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "#6B5744" }}>Data de revisão</label>
        <input
          type="date"
          value={dataRevisao}
          onChange={(e) => setDataRevisao(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "#6B5744" }}>Conteúdo (Markdown)</label>
        <textarea
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          rows={16}
          style={{ ...inputStyle, fontFamily: "monospace", resize: "vertical" }}
          placeholder={"# Título do POP\n\n## Objetivo\n..."}
        />
      </div>

      {erro && (
        <p className="text-sm px-3 py-2 rounded-lg" style={{ color: "#B91C1C", backgroundColor: "#FEF2F2" }}>
          {erro}
        </p>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={salvando}
          className="px-5 py-2 text-white text-sm font-medium rounded-lg transition-colors"
          style={{ backgroundColor: salvando ? "#D4B87A" : "#C8952A" }}
        >
          {salvando ? "Salvando..." : docId ? "Salvar alterações" : "Criar documento"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2 text-sm font-medium rounded-lg transition-colors"
          style={{ border: "1px solid #E8DDD0", color: "#6B5744", backgroundColor: "#fff" }}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
