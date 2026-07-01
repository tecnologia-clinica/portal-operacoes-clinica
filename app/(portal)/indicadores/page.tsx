import { Suspense } from "react";
import Link from "next/link";
import SetorTabs from "@/components/indicadores/SetorTabs";
import GraficoLeads from "@/components/indicadores/GraficoLeads";
import GraficoClinico from "@/components/indicadores/GraficoClinico";
import { db } from "@/lib/db";

type Props = { searchParams: Promise<{ tab?: string }> };

/* ─── Dados reais por setor ─────────────────────────────── */

const SAUDE_SETORES = [
  {
    id: "comercial",
    nome: "Comercial",
    status: "atencao",
    resumo: "726 leads · conv. 0,53%",
    detalhe: "-37% vs mai · funil com 64% de leads frios",
  },
  {
    id: "marketing",
    nome: "Marketing",
    status: "ok",
    resumo: "R$ 12.890 investidos (22d mai)",
    detalhe: "CAC est. ~R$ 730 · Google + Meta ativos",
  },
  {
    id: "clinico",
    nome: "Clínico",
    status: "critico",
    resumo: "24 cirurgias (mai)",
    detalhe: "Queda de 58% desde pico em março (57 cirurg.)",
  },
  {
    id: "atendimento",
    nome: "Atendimento",
    status: "critico",
    resumo: "4 min resposta · 70h maior espera",
    detalhe: "0 tarefas cadastradas · 0 motivos de perda registrados",
  },
  {
    id: "experiencia",
    nome: "Exp. Cliente",
    status: "sem_dado",
    resumo: "NPS: a implementar",
    detalhe: "Métricas de satisfação ainda não coletadas",
  },
];

const STATUS_COR: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  ok:       { bg: "rgba(21,128,61,0.07)",  text: "#15803D", dot: "#15803D", label: "OK" },
  atencao:  { bg: "rgba(200,149,42,0.1)",  text: "#A67A1E", dot: "#C8952A", label: "Atenção" },
  critico:  { bg: "rgba(185,28,28,0.07)",  text: "#B91C1C", dot: "#EF4444", label: "Crítico" },
  sem_dado: { bg: "rgba(156,163,175,0.1)", text: "#6B7280", dot: "#9CA3AF", label: "Sem dado" },
};

/* ─── Seção Comercial ───────────────────────────────────── */
function TabComercial({ db }: { db: { mes: number; ano: number; dados: DadosMetrica } | null }) {
  const d = db?.dados ?? {};
  const temDB = db !== null;

  const kpis = [
    { label: "Leads recebidos",      valor: temDB && d.leads_recebidos != null   ? String(d.leads_recebidos)   : "726",   meta: "1.000",  delta: null, ok: false },
    { label: "Conv. lead → cirurgia", valor: temDB && d.conv_lead_cirurgia_pct != null ? `${d.conv_lead_cirurgia_pct}%` : "0,53%", meta: "> 2%",   delta: null, ok: false },
    { label: "Leads qualificados",   valor: temDB && d.leads_qualificados != null ? String(d.leads_qualificados) : "—",    meta: null,     delta: null, ok: true  },
    { label: "Leads quentes",        valor: "3",     meta: "> 15",   delta: null, ok: false },
    { label: "Cancelamentos",        valor: temDB && d.cancelamentos != null      ? String(d.cancelamentos)      : "50",   meta: "< 30",   delta: null, ok: false },
    { label: "Cirurgias realizadas", valor: temDB && d.cirurgias_realizadas != null ? String(d.cirurgias_realizadas) : "24", meta: "35",  delta: null, ok: false },
  ];

  const funil = [
    { etapa: "Lead frio",          n: 466, pct: 64 },
    { etapa: "Aguardando retorno", n: 87,  pct: 12 },
    { etapa: "Lead morno",         n: 94,  pct: 13 },
    { etapa: "Cancelado",          n: 50,  pct: 7  },
    { etapa: "Lead quente",        n: 3,   pct: 0.4 },
    { etapa: "Consulta agendada",  n: 2,   pct: 0.3 },
  ];

  return (
    <div className="space-y-4">
      {temDB
        ? <BannerDados setor="comercial" mes={db!.mes} ano={db!.ano} dados={d} />
        : <BannerSemDados setor="comercial" />}
      <div className="grid grid-cols-3 gap-3">
        {kpis.map((k) => <KPICard key={k.label} {...k} />)}
      </div>
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3">
          <Suspense fallback={<Placeholder h={240} />}>
            <GraficoLeads />
          </Suspense>
        </div>
        <div className="col-span-2 bg-white rounded-xl p-4" style={{ border: "1px solid #E8DDD0" }}>
          <p className="text-sm font-semibold mb-1" style={{ color: "#2C1810" }}>Funil CRM — Junho</p>
          <p className="text-xs mb-3" style={{ color: "#9A8570" }}>726 leads · Kommo 30/06</p>
          <div className="space-y-2.5">
            {funil.map((f) => (
              <div key={f.etapa}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: "#6B5744" }}>{f.etapa}</span>
                  <span className="font-semibold" style={{ color: "#2C1810" }}>{f.n} <span style={{ color: "#9A8570", fontWeight: 400 }}>({f.pct}%)</span></span>
                </div>
                <div className="h-1.5 rounded-full" style={{ backgroundColor: "#F0E8DD" }}>
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${Math.min(f.pct, 100)}%`, backgroundColor: f.pct > 50 ? "#EF4444" : f.pct > 20 ? "#C8952A" : "#15803D" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <AlertaCard
        texto="410 leads analisados em 01-15/jun: apenas 1 conversão (<0,5%). 120 leads aguardando retorno sem follow-up estruturado."
        acao="Criar sequência de follow-up e preencher campo de motivo de perda no CRM."
      />
    </div>
  );
}

/* ─── Seção Marketing ───────────────────────────────────── */
function TabMarketing({ db }: { db: { mes: number; ano: number; dados: DadosMetrica } | null }) {
  const d = db?.dados ?? {};
  const temDB = db !== null;
  const fmt = (v: number) => `R$ ${v.toLocaleString("pt-BR")}`;

  const kpis = [
    { label: "Google Ads",    valor: temDB && d.investimento_google != null ? fmt(d.investimento_google) : "R$ 4.619",  meta: null,       delta: null, ok: true  },
    { label: "Meta Ads",      valor: temDB && d.investimento_meta   != null ? fmt(d.investimento_meta)   : "R$ 8.272",  meta: null,       delta: null, ok: true  },
    { label: "Total ads",     valor: temDB && (d.investimento_meta != null && d.investimento_google != null) ? fmt((d.investimento_meta ?? 0) + (d.investimento_google ?? 0)) : "R$ 12.890", meta: null, delta: null, ok: true },
    { label: "CAC",           valor: temDB && d.cac                 != null ? fmt(d.cac)                 : "~R$ 730",   meta: "< R$ 500", delta: null, ok: false },
    { label: "CPL Meta",      valor: temDB && d.cpl_meta            != null ? fmt(d.cpl_meta)            : "~R$ 17",    meta: "< R$ 10",  delta: null, ok: false },
    { label: "Leads pagos",   valor: temDB && d.leads_pagos         != null ? String(d.leads_pagos)      : "—",         meta: null,       delta: null, ok: true  },
  ];

  const canais = [
    { canal: "Meta Ads", valor: 8272, pct: 64, cor: "#1877F2" },
    { canal: "Google Ads", valor: 4619, pct: 36, cor: "#EA4335" },
  ];

  return (
    <div className="space-y-4">
      {temDB
        ? <BannerDados setor="marketing" mes={db!.mes} ano={db!.ano} dados={d} />
        : <BannerSemDados setor="marketing" />}
      <div className="grid grid-cols-3 gap-3">
        {kpis.map((k) => <KPICard key={k.label} {...k} />)}
      </div>
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 bg-white rounded-xl p-4" style={{ border: "1px solid #E8DDD0" }}>
          <p className="text-sm font-semibold mb-1" style={{ color: "#2C1810" }}>Mix de investimento</p>
          <p className="text-xs mb-4" style={{ color: "#9A8570" }}>Maio 2026 · 22 dias · dados parciais</p>
          <div className="space-y-4">
            {canais.map((c) => (
              <div key={c.canal}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: "#6B5744" }}>{c.canal}</span>
                  <span className="font-semibold" style={{ color: "#2C1810" }}>
                    R$ {c.valor.toLocaleString("pt-BR")} <span style={{ color: "#9A8570", fontWeight: 400 }}>({c.pct}%)</span>
                  </span>
                </div>
                <div className="h-2 rounded-full" style={{ backgroundColor: "#F0E8DD" }}>
                  <div className="h-2 rounded-full" style={{ width: `${c.pct}%`, backgroundColor: c.cor, opacity: 0.75 }} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs mt-4 pt-3" style={{ borderTop: "1px solid #F0E8DD", color: "#9A8570" }}>
            * Projeção mês completo: ~R$ 17.600 · junho ainda não disponível
          </p>
        </div>
        <div className="col-span-2 space-y-3">
          <div className="bg-white rounded-xl p-4" style={{ border: "1px solid #E8DDD0" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#9A8570" }}>Fórmula CAC</p>
            <p className="text-xs" style={{ color: "#6B5744" }}>Investimento ads ÷ cirurgias realizadas</p>
            <p className="text-xl font-bold mt-1" style={{ color: "#2C1810" }}>R$ 17.584 ÷ 24</p>
            <p className="text-sm font-semibold" style={{ color: "#C8952A" }}>= ~R$ 733 / cirurgia</p>
            <p className="text-xs mt-2" style={{ color: "#9A8570" }}>Base: projeção mai completo</p>
          </div>
          <div className="bg-white rounded-xl p-4" style={{ border: "1px solid #E8DDD0" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#9A8570" }}>CPL por canal</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between"><span style={{ color: "#6B5744" }}>Google Ads</span><span className="font-semibold" style={{ color: "#2C1810" }}>~R$ 62 / conversão</span></div>
              <div className="flex justify-between"><span style={{ color: "#6B5744" }}>Meta (WhatsApp)</span><span className="font-semibold" style={{ color: "#2C1810" }}>~R$ 17 / lead</span></div>
            </div>
          </div>
        </div>
      </div>
      <AlertaCard
        texto="Dados de marketing baseados em 22 dias de maio — extrapolação necessária. Junho ainda não disponível."
        acao="Solicitar relatório completo de ads de junho ao gestor de tráfego."
        nivel="aviso"
      />
    </div>
  );
}

/* ─── Seção Clínico ─────────────────────────────────────── */
function TabClinico({ db }: { db: { mes: number; ano: number; dados: DadosMetrica } | null }) {
  const d = db?.dados ?? {};
  const temDB = db !== null;

  const kpis = [
    { label: "Cirurgias realizadas",  valor: temDB && d.cirurgias_realizadas != null ? String(d.cirurgias_realizadas) : "24",   meta: "35",  delta: null, ok: false },
    { label: "Consultas realizadas",  valor: temDB && d.consultas_realizadas != null ? String(d.consultas_realizadas) : "20",   meta: "30",  delta: null, ok: false },
    { label: "Retornos",              valor: temDB && d.retornos              != null ? String(d.retornos)              : "—",   meta: null,  delta: null, ok: true  },
    { label: "Proc./cirurgia",        valor: temDB && d.procedimentos_por_cirurgia != null ? String(d.procedimentos_por_cirurgia) : "4,54", meta: null, delta: null, ok: true },
    { label: "Satisfação",            valor: temDB && d.satisfacao_pct        != null ? `${d.satisfacao_pct}%`         : "—",   meta: "> 90%", delta: null, ok: true },
    { label: "Pico do ano (mar)",     valor: "57",   meta: null,    delta: null, ok: true  },
  ];

  return (
    <div className="space-y-4">
      {temDB
        ? <BannerDados setor="clinico" mes={db!.mes} ano={db!.ano} dados={d} />
        : <BannerSemDados setor="clinico" />}
      <div className="grid grid-cols-3 gap-3">
        {kpis.map((k) => <KPICard key={k.label} {...k} />)}
      </div>
      <Suspense fallback={<Placeholder h={240} />}>
        <GraficoClinico />
      </Suspense>
      <AlertaCard
        texto="Cirurgias caíram 58% de março (57) para maio (24). Queda acentuada a ser investigada — sazonal ou operacional?"
        acao="Revisar agenda de março vs maio e identificar causas da queda (feriados, férias, cancelamentos)."
      />
    </div>
  );
}

/* ─── Seção Atendimento ─────────────────────────────────── */
function TabAtendimento({ db }: { db: { mes: number; ano: number; dados: DadosMetrica } | null }) {
  const d = db?.dados ?? {};
  const temDB = db !== null;

  const kpis = [
    { label: "Resposta média (min)",     valor: temDB && d.tempo_resposta_min   != null ? `${d.tempo_resposta_min} min` : "4 min",   meta: "< 2 min",  delta: null, ok: false },
    { label: "Maior espera s/ aten.",    valor: temDB && d.maior_espera_horas   != null ? `${d.maior_espera_horas}h`   : "70h",      meta: "< 4h",     delta: null, ok: false },
    { label: "Mensagens recebidas",      valor: temDB && d.mensagens_recebidas  != null ? String(d.mensagens_recebidas) : "1.954",   meta: null,       delta: null, ok: true  },
    { label: "Tarefas de follow-up",     valor: temDB && d.tarefas_followup     != null ? String(d.tarefas_followup)   : "0",        meta: "> 10/sem", delta: null, ok: false },
    { label: "NPS",                      valor: temDB && d.nps                  != null ? String(d.nps)                : "—",        meta: "> 70",     delta: null, ok: true  },
    { label: "Reclamações",              valor: temDB && d.reclamacoes          != null ? String(d.reclamacoes)        : "—",        meta: "0",        delta: null, ok: false },
  ];

  const acoes = [
    { prioridade: "Alta", acao: "Sequência de follow-up para 120 leads em 'Aguardando Retorno'" },
    { prioridade: "Alta", acao: "Preencher campo 'Motivo de perda' em todos os cancelamentos (atualmente: 0%)" },
    { prioridade: "Alta", acao: "Criar tarefas de recontato para 3 leads quentes + 45 mornos" },
    { prioridade: "Média", acao: "Triagem rápida na entrada — filtrar fora de escopo e fora de SP" },
    { prioridade: "Média", acao: "Protocolo de nurturing para objeção de preço (60-65% dos cancelamentos)" },
  ];

  return (
    <div className="space-y-4">
      {temDB
        ? <BannerDados setor="atendimento" mes={db!.mes} ano={db!.ano} dados={d} />
        : <BannerSemDados setor="atendimento" />}
      <div className="grid grid-cols-3 gap-3">
        {kpis.map((k) => <KPICard key={k.label} {...k} />)}
      </div>
      <div className="bg-white rounded-xl p-4" style={{ border: "1px solid #E8DDD0" }}>
        <p className="text-sm font-semibold mb-3" style={{ color: "#2C1810" }}>Ações recomendadas · Diagnóstico Comercial</p>
        <div className="space-y-2">
          {acoes.map((a, i) => (
            <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg" style={{ backgroundColor: "#F7F3EE" }}>
              <span
                className="text-xs font-semibold px-1.5 py-0.5 rounded mt-0.5 shrink-0"
                style={{
                  backgroundColor: a.prioridade === "Alta" ? "rgba(185,28,28,0.08)" : "rgba(200,149,42,0.1)",
                  color: a.prioridade === "Alta" ? "#B91C1C" : "#A67A1E",
                }}
              >
                {a.prioridade}
              </span>
              <p className="text-xs" style={{ color: "#6B5744" }}>{a.acao}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Seção Experiência do Cliente ──────────────────────── */
function TabExperiencia({ db }: { db: { mes: number; ano: number; dados: DadosMetrica } | null }) {
  const d = db?.dados ?? {};
  const temDB = db !== null;
  const metricas = [
    { label: "NPS",                    valor: temDB && d.nps != null ? String(d.nps) : "—",   meta: "> 70",  status: d.nps != null ? "ok" : "sem_dado", desc: "Pesquisa pós-cirurgia" },
    { label: "Satisfação atendimento", valor: temDB && d.satisfacao_atendimento != null ? String(d.satisfacao_atendimento) : "—",   meta: "> 4,5", status: d.satisfacao_atendimento != null ? "ok" : "sem_dado", desc: "Avaliação WhatsApp / Google" },
    { label: "Retorno pós-op",         valor: temDB && d.retorno_posop_pct != null ? `${d.retorno_posop_pct}%` : "—",   meta: "> 90%", status: d.retorno_posop_pct != null ? "ok" : "sem_dado", desc: "Adesão ao protocolo" },
    { label: "Espera p/ consulta",     valor: temDB && d.tempo_espera_consulta_dias != null ? `${d.tempo_espera_consulta_dias}d` : "—",   meta: "< 7d",  status: d.tempo_espera_consulta_dias != null ? "ok" : "sem_dado", desc: "Dias até primeira consulta" },
    { label: "Cancelamentos cirurgia", valor: temDB && d.cancelamentos_cirurgia_pct != null ? `${d.cancelamentos_cirurgia_pct}%` : "—",   meta: "< 5%",  status: d.cancelamentos_cirurgia_pct != null ? "ok" : "sem_dado", desc: "% cirurgias canceladas" },
    { label: "Reclamações formais",    valor: temDB && d.reclamacoes_formais != null ? String(d.reclamacoes_formais) : "—",   meta: "0",     status: d.reclamacoes_formais != null ? "ok" : "sem_dado", desc: "Canal formal de reclamação" },
  ];

  return (
    <div className="space-y-4">
      {temDB
        ? <BannerDados setor="experiencia" mes={db!.mes} ano={db!.ano} dados={d} />
        : <BannerSemDados setor="experiencia" />}
      <div className="bg-white rounded-xl p-4" style={{ border: "1px solid #E8DDD0" }}>
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠</span>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#2C1810" }}>Módulo em estruturação</p>
            <p className="text-xs mt-1" style={{ color: "#6B5744" }}>
              Nenhuma das métricas de experiência do cliente está sendo coletada sistematicamente.
              As metas abaixo são recomendações baseadas em benchmarks para clínicas de cirurgia plástica premium.
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {metricas.map((m) => (
          <div key={m.label} className="bg-white rounded-xl p-4" style={{ border: "1px solid #E8DDD0" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#9A8570" }}>{m.label}</p>
            <p className="text-2xl font-bold mt-1 mb-1" style={{ color: "#B8A898" }}>{m.valor}</p>
            <p className="text-xs mb-2" style={{ color: "#C8952A" }}>Meta: {m.meta}</p>
            <p className="text-xs" style={{ color: "#9A8570" }}>{m.desc}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl p-4" style={{ border: "1px solid #E8DDD0" }}>
        <p className="text-sm font-semibold mb-3" style={{ color: "#2C1810" }}>Como implementar</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { step: "1", titulo: "NPS pós-cirurgia", desc: "Envio automático via WhatsApp 30 dias após cirurgia — Google Forms + planilha de consolidação" },
            { step: "2", titulo: "Protocolo pós-op no CRM", desc: "Campo de 'Retorno pós-op confirmado' na pipeline do Kommo, com tarefa automática" },
            { step: "3", titulo: "Google Reviews", desc: "Solicitar avaliação no Google no mesmo fluxo do NPS — meta: 10 avaliações/mês" },
            { step: "4", titulo: "Pesquisa de atendimento", desc: "Star rating ao final do atendimento WhatsApp — integrar via Kommo ou Typebot" },
          ].map((s) => (
            <div key={s.step} className="flex gap-3 p-3 rounded-lg" style={{ backgroundColor: "#F7F3EE" }}>
              <span className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: "rgba(200,149,42,0.2)", color: "#A67A1E" }}>{s.step}</span>
              <div>
                <p className="text-xs font-semibold" style={{ color: "#2C1810" }}>{s.titulo}</p>
                <p className="text-xs mt-0.5" style={{ color: "#6B5744" }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Visão Geral ───────────────────────────────────────── */
function TabGeral({ dadosPorSetor }: { dadosPorSetor: Record<string, { mes: number; ano: number; dados: DadosMetrica } | null> }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-3">
        {SAUDE_SETORES.map((s) => {
          const cor = STATUS_COR[s.status];
          return (
            <div key={s.id} className="bg-white rounded-xl p-4" style={{ border: "1px solid #E8DDD0" }}>
              <div className="flex items-center gap-1.5 mb-3">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cor.dot }} />
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: cor.bg, color: cor.text }}>{cor.label}</span>
              </div>
              <p className="text-sm font-semibold" style={{ color: "#2C1810" }}>{s.nome}</p>
              <p className="text-xs font-medium mt-1" style={{ color: "#6B5744" }}>{s.resumo}</p>
              <p className="text-xs mt-1.5" style={{ color: "#9A8570" }}>{s.detalhe}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Suspense fallback={<Placeholder h={240} />}><GraficoLeads /></Suspense>
        <Suspense fallback={<Placeholder h={240} />}><GraficoClinico /></Suspense>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <AlertaCard
          titulo="Atendimento crítico"
          texto="70h de maior espera sem atendimento e 0 tarefas de follow-up cadastradas."
          acao="Ver detalhes → aba Atendimento"
          nivel="critico"
        />
        <AlertaCard
          titulo="Conversão muito baixa"
          texto="726 leads em junho, apenas 0,53% converte em cirurgia ao longo de 6 meses."
          acao="Ver detalhes → aba Comercial"
          nivel="critico"
        />
        <AlertaCard
          titulo="Experiência não medida"
          texto="NPS, satisfação e retorno pós-op sem coleta sistemática."
          acao="Ver plano de implementação → aba Exp. Cliente"
          nivel="aviso"
        />
      </div>
    </div>
  );
}

/* ─── Componentes auxiliares ─────────────────────────────── */

function KPICard({ label, valor, meta, delta, ok }: {
  label: string; valor: string; meta?: string | null; delta?: number | null; ok: boolean;
}) {
  return (
    <div className="bg-white rounded-xl p-4" style={{ border: "1px solid #E8DDD0" }}>
      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#9A8570" }}>{label}</p>
      <p className="text-2xl font-bold" style={{ color: ok ? "#2C1810" : "#B91C1C" }}>{valor}</p>
      {meta && <p className="text-xs mt-1" style={{ color: "#9A8570" }}>Meta: <span style={{ color: "#6B5744" }}>{meta}</span></p>}
      {delta !== null && delta !== undefined && (
        <p className="text-xs mt-1.5 font-medium" style={{ color: delta >= 0 ? "#15803D" : "#B91C1C" }}>
          {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}% vs mês ant.
        </p>
      )}
    </div>
  );
}

function AlertaCard({ titulo, texto, acao, nivel = "critico" }: {
  titulo?: string; texto: string; acao: string; nivel?: "critico" | "aviso";
}) {
  const isCrit = nivel === "critico";
  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: isCrit ? "rgba(185,28,28,0.04)" : "rgba(200,149,42,0.06)",
        border: `1px solid ${isCrit ? "rgba(185,28,28,0.15)" : "rgba(200,149,42,0.2)"}`,
      }}
    >
      {titulo && <p className="text-xs font-semibold mb-1" style={{ color: isCrit ? "#B91C1C" : "#A67A1E" }}>{titulo}</p>}
      <p className="text-xs" style={{ color: "#6B5744" }}>{texto}</p>
      <p className="text-xs mt-2 font-medium" style={{ color: isCrit ? "#B91C1C" : "#A67A1E" }}>→ {acao}</p>
    </div>
  );
}

function Placeholder({ h }: { h: number }) {
  return <div className="bg-white rounded-xl" style={{ border: "1px solid #E8DDD0", height: h }} />;
}

/* ─── Helpers ───────────────────────────────────────────── */

type DadosMetrica = Record<string, number | null>;

function BannerDados({ setor, mes, ano, dados }: { setor: string; mes: number; ano: number; dados: DadosMetrica }) {
  const NOME_MES = ["", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const validos  = Object.entries(dados).filter(([, v]) => v !== null);
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(21,128,61,0.05)", border: "1px solid rgba(21,128,61,0.2)" }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold" style={{ color: "#15803D" }}>
            ✓ Dados importados — {NOME_MES[mes]} {ano}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#6B5744" }}>
            {validos.length} métricas disponíveis no banco. Os valores abaixo refletem os dados mais recentes.
          </p>
        </div>
        <Link
          href="/metricas/importar"
          className="text-xs font-medium px-3 py-1.5 rounded-lg shrink-0"
          style={{ backgroundColor: "rgba(21,128,61,0.1)", color: "#15803D" }}
        >
          Atualizar dados
        </Link>
      </div>
    </div>
  );
}

function BannerSemDados({ setor }: { setor: string }) {
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: "#F7F3EE", border: "1px solid #E8DDD0" }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold" style={{ color: "#6B5744" }}>Dados históricos — análise inicial</p>
          <p className="text-xs mt-0.5" style={{ color: "#9A8570" }}>
            Nenhum CSV foi importado ainda para este setor. Os dados abaixo são da análise inicial de jun/2026.
          </p>
        </div>
        <Link
          href={`/metricas/importar`}
          className="text-xs font-medium px-3 py-1.5 rounded-lg shrink-0"
          style={{ backgroundColor: "rgba(200,149,42,0.12)", color: "#A67A1E" }}
        >
          Importar dados →
        </Link>
      </div>
    </div>
  );
}

/* ─── KPIs dinâmicos do DB ──────────────────────────────── */

function KPIsDB({ dados, campos }: {
  dados: DadosMetrica;
  campos: { chave: string; label: string; meta?: string; formato?: (v: number) => string; critico?: (v: number) => boolean }[];
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {campos.map((c) => {
        const val = dados[c.chave];
        if (val === undefined && !dados.hasOwnProperty(c.chave)) return null;
        const formatado = val !== null && val !== undefined
          ? (c.formato ? c.formato(val) : String(val))
          : "—";
        const isOk = val !== null && c.critico ? !c.critico(val) : true;
        return (
          <div key={c.chave} className="bg-white rounded-xl p-4" style={{ border: "1px solid #E8DDD0" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#9A8570" }}>{c.label}</p>
            <p className="text-2xl font-bold" style={{ color: val === null ? "#9A8570" : isOk ? "#2C1810" : "#B91C1C" }}>
              {formatado}
            </p>
            {c.meta && <p className="text-xs mt-1" style={{ color: "#9A8570" }}>Meta: <span style={{ color: "#6B5744" }}>{c.meta}</span></p>}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────── */

export default async function IndicadoresPage({ searchParams }: Props) {
  const { tab = "geral" } = await searchParams;

  const TITULO: Record<string, string> = {
    geral:       "Visão Geral",
    comercial:   "Comercial",
    marketing:   "Marketing",
    clinico:     "Clínico / Cirúrgico",
    atendimento: "Atendimento",
    experiencia: "Experiência do Cliente",
  };

  // Busca os dados mais recentes do banco para todos os setores
  const setores = ["comercial", "marketing", "clinico", "atendimento", "experiencia"];
  const metricasDB = await db.metricaMensal.findMany({
    where: { setor: { in: setores } },
    orderBy: [{ ano: "desc" }, { mes: "desc" }],
  });

  // Pega o registro mais recente por setor
  const dadosPorSetor: Record<string, { mes: number; ano: number; dados: DadosMetrica } | null> = {};
  for (const s of setores) {
    const reg = metricasDB.find((m) => m.setor === s);
    dadosPorSetor[s] = reg ? { mes: reg.mes, ano: reg.ano, dados: reg.dados as DadosMetrica } : null;
  }

  const dbAtualizado = dadosPorSetor[tab === "geral" ? "comercial" : tab];
  const nomeMes  = ["", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const periodoLabel = dbAtualizado
    ? `${nomeMes[dbAtualizado.mes]} ${dbAtualizado.ano}`
    : "Jun 2026 · análise inicial";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#2C1810" }}>Indicadores</h1>
          <p className="text-sm mt-0.5" style={{ color: "#9A8570" }}>{TITULO[tab] ?? "Visão Geral"} · {periodoLabel}</p>
        </div>
        <Link
          href="/metricas/importar"
          className="text-xs font-medium px-3 py-1 rounded-full"
          style={{ backgroundColor: "rgba(200,149,42,0.12)", color: "#A67A1E" }}
        >
          ↑ Importar dados
        </Link>
      </div>

      <Suspense fallback={null}>
        <SetorTabs ativo={tab} />
      </Suspense>

      {tab === "geral"       && <TabGeral dadosPorSetor={dadosPorSetor} />}
      {tab === "comercial"   && <TabComercial db={dadosPorSetor.comercial} />}
      {tab === "marketing"   && <TabMarketing db={dadosPorSetor.marketing} />}
      {tab === "clinico"     && <TabClinico db={dadosPorSetor.clinico} />}
      {tab === "atendimento" && <TabAtendimento db={dadosPorSetor.atendimento} />}
      {tab === "experiencia" && <TabExperiencia db={dadosPorSetor.experiencia} />}
    </div>
  );
}
