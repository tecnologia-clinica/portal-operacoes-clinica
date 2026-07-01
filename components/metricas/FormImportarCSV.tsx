"use client";

import { useState, useRef } from "react";
import { importarMetricas } from "@/app/actions/metricas";

const SETORES = [
  { value: "comercial",   label: "Comercial" },
  { value: "marketing",   label: "Marketing" },
  { value: "clinico",     label: "Clínico / Cirúrgico" },
  { value: "atendimento", label: "Atendimento" },
  { value: "experiencia", label: "Experiência do Cliente" },
  { value: "financeiro",  label: "Financeiro" },
];

const MESES = [
  { value: "1",  label: "Janeiro" },  { value: "2",  label: "Fevereiro" },
  { value: "3",  label: "Março" },    { value: "4",  label: "Abril" },
  { value: "5",  label: "Maio" },     { value: "6",  label: "Junho" },
  { value: "7",  label: "Julho" },    { value: "8",  label: "Agosto" },
  { value: "9",  label: "Setembro" }, { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" }, { value: "12", label: "Dezembro" },
];

const TEMPLATES: Record<string, string> = {
  comercial: [
    "metrica,valor",
    "leads_recebidos,",
    "leads_qualificados,",
    "consultas_realizadas,",
    "cirurgias_realizadas,",
    "receita_estimada,",
    "cancelamentos,",
    "novos_orcamentos,",
    "conv_lead_cirurgia_pct,",
  ].join("\n"),
  marketing: [
    "metrica,valor",
    "investimento_meta,",
    "investimento_google,",
    "leads_pagos,",
    "leads_organicos,",
    "cpl_meta,",
    "cpl_google,",
    "cac,",
    "impressoes,",
  ].join("\n"),
  clinico: [
    "metrica,valor",
    "cirurgias_realizadas,",
    "consultas_realizadas,",
    "retornos,",
    "satisfacao_pct,",
    "taxa_complicacoes_pct,",
    "procedimentos_por_cirurgia,",
  ].join("\n"),
  atendimento: [
    "metrica,valor",
    "tempo_resposta_min,",
    "maior_espera_horas,",
    "mensagens_recebidas,",
    "tarefas_followup,",
    "nps,",
    "reclamacoes,",
    "elogios,",
    "taxa_resposta_pct,",
  ].join("\n"),
  experiencia: [
    "metrica,valor",
    "nps,",
    "satisfacao_atendimento,",
    "retorno_posop_pct,",
    "tempo_espera_consulta_dias,",
    "cancelamentos_cirurgia_pct,",
    "reclamacoes_formais,",
    "avaliacoes_google,",
  ].join("\n"),
  financeiro: [
    "metrica,valor",
    "consultas_marcadas,",
    "consultas_agendadas,",
    "consultas_fechadas,",
    "cirurgias_quantidade,",
    "cirurgias_valor,",
    "receita_total,",
    "receita_consultas,",
    "ticket_medio_cirurgia,",
    "inadimplencia_valor,",
    "cancelamentos_valor,",
  ].join("\n"),
};

const LABEL_AMIGAVEL: Record<string, string> = {
  leads_recebidos:           "Leads recebidos",
  leads_qualificados:        "Leads qualificados",
  consultas_realizadas:      "Consultas realizadas",
  cirurgias_realizadas:      "Cirurgias realizadas",
  receita_estimada:          "Receita estimada (R$)",
  cancelamentos:             "Cancelamentos",
  novos_orcamentos:          "Novos orçamentos",
  conv_lead_cirurgia_pct:    "Conv. lead → cirurgia (%)",
  investimento_meta:         "Investimento Meta Ads (R$)",
  investimento_google:       "Investimento Google Ads (R$)",
  leads_pagos:               "Leads pagos",
  leads_organicos:           "Leads orgânicos",
  cpl_meta:                  "CPL Meta (R$)",
  cpl_google:                "CPL Google (R$)",
  cac:                       "CAC (R$)",
  impressoes:                "Impressões",
  retornos:                  "Retornos",
  satisfacao_pct:            "Satisfação (%)",
  taxa_complicacoes_pct:     "Taxa complicações (%)",
  procedimentos_por_cirurgia:"Procedimentos por cirurgia",
  tempo_resposta_min:        "Tempo de resposta (min)",
  maior_espera_horas:        "Maior espera sem atend. (h)",
  mensagens_recebidas:       "Mensagens recebidas",
  tarefas_followup:          "Tarefas de follow-up",
  nps:                       "NPS",
  reclamacoes:               "Reclamações",
  elogios:                   "Elogios",
  taxa_resposta_pct:         "Taxa de resposta (%)",
  satisfacao_atendimento:    "Satisfação atendimento",
  retorno_posop_pct:         "Retorno pós-op (%)",
  tempo_espera_consulta_dias:"Espera p/ consulta (dias)",
  cancelamentos_cirurgia_pct:"Cancelamentos cirurgia (%)",
  reclamacoes_formais:       "Reclamações formais",
  avaliacoes_google:         "Avaliações Google",
  consultas_marcadas:        "Consultas marcadas",
  consultas_agendadas:       "Consultas agendadas",
  consultas_fechadas:        "Consultas fechadas / realizadas",
  cirurgias_quantidade:      "Cirurgias — quantidade",
  cirurgias_valor:           "Cirurgias — valor total (R$)",
  receita_total:             "Receita total (R$)",
  receita_consultas:         "Receita de consultas (R$)",
  ticket_medio_cirurgia:     "Ticket médio por cirurgia (R$)",
  inadimplencia_valor:       "Inadimplência (R$)",
  cancelamentos_valor:       "Cancelamentos — valor perdido (R$)",
};

type LinhaPreview = { metrica: string; valor: string; valido: boolean };

export default function FormImportarCSV({ setorInicial }: { setorInicial?: string }) {
  const anoAtual  = new Date().getFullYear().toString();
  const mesAtual  = String(new Date().getMonth() + 1);

  const [setor,    setSetor]    = useState(setorInicial ?? "comercial");
  const [mes,      setMes]      = useState(mesAtual);
  const [ano,      setAno]      = useState(anoAtual);
  const [preview,  setPreview]  = useState<LinhaPreview[] | null>(null);
  const [erro,     setErro]     = useState("");
  const [ok,       setOk]       = useState(false);
  const [salvando, setSalvando] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function downloadTemplate() {
    const csv  = TEMPLATES[setor];
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `template-${setor}-${String(mes).padStart(2, "0")}-${ano}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setPreview(null);
    setErro("");
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const texto  = ev.target?.result as string;
      const linhas = texto.trim().split(/\r?\n/).filter((l) => l.trim());
      if (linhas.length < 2) { setErro("CSV vazio ou sem dados além do cabeçalho"); return; }

      const rows: LinhaPreview[] = [];
      for (let i = 1; i < linhas.length; i++) {
        const partes = linhas[i].split(",");
        if (partes.length < 2 || !partes[0].trim()) continue;
        const chave  = partes[0].trim().toLowerCase();
        const rawVal = partes[1].trim();
        const valido = rawVal !== "" && !isNaN(parseFloat(rawVal));
        rows.push({ metrica: chave, valor: rawVal, valido });
      }
      setPreview(rows);
    };
    reader.readAsText(file);
  }

  async function handleSubmit(formData: FormData) {
    setSalvando(true);
    setErro("");
    setOk(false);
    try {
      await importarMetricas(formData);
      setOk(true);
      formRef.current?.reset();
      setPreview(null);
    } catch (e: any) {
      setErro(e.message ?? "Erro ao importar");
    } finally {
      setSalvando(false);
    }
  }

  const inputCls = "w-full text-sm px-3 py-2 rounded-lg";
  const inputStyle = { border: "1px solid #E8DDD0", color: "#2C1810", backgroundColor: "#FAFAF8" };
  const labelCls = "block text-xs font-medium mb-1";
  const labelStyle = { color: "#6B5744" };

  const previewValidos = preview?.filter((r) => r.valido) ?? [];
  const temDados = previewValidos.length > 0;

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-5">
      {/* Setor + Período */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelCls} style={labelStyle}>Setor *</label>
          <select
            name="setor"
            value={setor}
            onChange={(e) => { setSetor(e.target.value); setPreview(null); }}
            className={inputCls}
            style={inputStyle}
          >
            {SETORES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls} style={labelStyle}>Mês *</label>
          <select name="mes" value={mes} onChange={(e) => setMes(e.target.value)} className={inputCls} style={inputStyle}>
            {MESES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls} style={labelStyle}>Ano *</label>
          <input
            name="ano"
            type="number"
            min="2024"
            max="2035"
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            className={inputCls}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Download template */}
      <div className="p-4 rounded-xl" style={{ backgroundColor: "#F7F3EE", border: "1px solid #E8DDD0" }}>
        <p className="text-xs font-semibold mb-1" style={{ color: "#2C1810" }}>1. Baixe o template do setor</p>
        <p className="text-xs mb-3" style={{ color: "#9A8570" }}>
          Preencha os valores no Excel ou Google Sheets e salve como .csv
        </p>
        <button
          type="button"
          onClick={downloadTemplate}
          className="text-xs font-medium px-3 py-1.5 rounded-lg"
          style={{ backgroundColor: "rgba(200,149,42,0.12)", color: "#A67A1E", border: "1px solid rgba(200,149,42,0.25)" }}
        >
          ↓ Baixar template — {SETORES.find((s) => s.value === setor)?.label}
        </button>
      </div>

      {/* Upload */}
      <div>
        <p className="text-xs font-semibold mb-1" style={{ color: "#2C1810" }}>2. Envie o arquivo preenchido</p>
        <label className={labelCls} style={labelStyle}>Arquivo CSV *</label>
        <input
          name="arquivo"
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          required
          className="w-full text-sm"
          style={{ color: "#6B5744" }}
        />
      </div>

      {/* Preview */}
      {preview !== null && (
        <div>
          <p className="text-xs font-semibold mb-2" style={{ color: "#2C1810" }}>
            3. Confirme os dados detectados ({previewValidos.length} métricas com valor)
          </p>
          {preview.length === 0 ? (
            <p className="text-xs" style={{ color: "#B91C1C" }}>Nenhuma linha válida encontrada no arquivo.</p>
          ) : (
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #E8DDD0" }}>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ backgroundColor: "#FBF8F4" }}>
                    <th className="text-left px-4 py-2.5 font-medium" style={{ color: "#9A8570" }}>Métrica</th>
                    <th className="text-right px-4 py-2.5 font-medium" style={{ color: "#9A8570" }}>Valor</th>
                    <th className="text-center px-4 py-2.5 font-medium" style={{ color: "#9A8570" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row) => (
                    <tr key={row.metrica} style={{ borderTop: "1px solid #F7F3EE" }}>
                      <td className="px-4 py-2" style={{ color: "#2C1810" }}>
                        {LABEL_AMIGAVEL[row.metrica] ?? row.metrica}
                      </td>
                      <td className="px-4 py-2 text-right font-semibold" style={{ color: row.valido ? "#2C1810" : "#9A8570" }}>
                        {row.valor || "—"}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {row.valido
                          ? <span style={{ color: "#15803D" }}>✓</span>
                          : <span style={{ color: "#9A8570" }}>vazio</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Feedback */}
      {erro && (
        <div className="px-4 py-3 rounded-lg text-xs" style={{ backgroundColor: "rgba(185,28,28,0.06)", color: "#B91C1C" }}>
          {erro}
        </div>
      )}
      {ok && (
        <div className="px-4 py-3 rounded-lg text-xs" style={{ backgroundColor: "rgba(21,128,61,0.06)", color: "#15803D" }}>
          ✓ Dados importados com sucesso! Os indicadores já refletem os novos valores.
        </div>
      )}

      <button
        type="submit"
        disabled={salvando || !temDados}
        className="px-5 py-2.5 rounded-lg text-sm font-medium"
        style={{
          backgroundColor: salvando || !temDados ? "#D4B87A" : "#C8952A",
          color: "#fff",
          cursor: salvando || !temDados ? "not-allowed" : "pointer",
        }}
      >
        {salvando ? "Importando..." : `Importar ${previewValidos.length > 0 ? `${previewValidos.length} métricas` : "dados"}`}
      </button>
    </form>
  );
}
