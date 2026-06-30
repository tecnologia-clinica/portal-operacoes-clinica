import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { salvarAcompanhamento, type MetaItem } from "@/app/actions/acompanhamento";
import FormAcompanhamento from "./FormAcompanhamento";

const MESES = [
  "","Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];

// Metas padrão por mês — pré-populadas para Jun 2026 com dados reais
const METAS_PADRAO: MetaItem[] = [
  { label: "Leads recebidos",    meta: 1000, realizado: 726, unidade: "leads",   fonte: "Kommo 30/06"         },
  { label: "Cirurgias",          meta: 35,   realizado: 24,  unidade: "proc.",   fonte: "Analise Estratégica" },
  { label: "Consultas",          meta: 30,   realizado: 20,  unidade: "consult.",fonte: "Procedimentos CSV"    },
  { label: "Investimento ads",   meta: 18000,realizado: 12890,unidade:"R$",      fonte: "Ads mai (22d)"       },
  { label: "CAC (estimado)",     meta: 500,  realizado: 730, unidade: "R$",      fonte: "Estimado"            },
  { label: "Conv. lead→cirurg.", meta: 2.0,  realizado: 0.53,unidade: "%",       fonte: "Diag. Comercial"     },
];

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ editar?: string }> };

export default async function AcompanhamentoDetalhe({ params, searchParams }: Props) {
  const { slug }  = await params;
  const { editar } = await searchParams;

  const match = slug.match(/^(\d{4})-(\d{2})$/);
  if (!match) notFound();

  const ano = parseInt(match[1]);
  const mes = parseInt(match[2]);

  if (isNaN(ano) || isNaN(mes) || mes < 1 || mes > 12) notFound();

  const registro = await db.acompanhamentoMensal.findUnique({
    where: { mes_ano: { mes, ano } },
    include: { autor: { select: { nome: true } } },
  });

  const modoEditar = editar === "1" || !registro;

  const destaques     = (registro?.destaques     as string[]) ?? [];
  const desafios      = (registro?.desafios      as string[]) ?? [];
  const pendencias    = (registro?.pendencias    as string[]) ?? [];
  const proximosMeses = (registro?.proximosMeses as string[]) ?? [];
  const metas         = (registro?.metas         as MetaItem[]) ?? METAS_PADRAO;
  const observacoes   = registro?.observacoes ?? "";

  const action = salvarAcompanhamento.bind(null, slug);

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/acompanhamento" className="text-xs" style={{ color: "#9A8570" }}>← Acompanhamento</Link>
          </div>
          <h1 className="text-xl font-semibold mt-1" style={{ color: "#2C1810" }}>
            {MESES[mes]} {ano}
          </h1>
          {registro && (
            <p className="text-xs mt-0.5" style={{ color: "#9A8570" }}>
              {registro.status === "publicado" ? "✓ Publicado" : "Rascunho"} ·
              por {registro.autor.nome} ·
              {new Date(registro.atualizadoEm).toLocaleDateString("pt-BR")}
            </p>
          )}
        </div>
        {!modoEditar && (
          <Link
            href={`/acompanhamento/${slug}?editar=1`}
            className="text-sm font-medium px-4 py-2 rounded-lg"
            style={{ backgroundColor: "rgba(200,149,42,0.1)", color: "#A67A1E" }}
          >
            Editar
          </Link>
        )}
      </div>

      {modoEditar ? (
        <FormAcompanhamento
          slug={slug}
          action={action}
          metas={metas}
          destaques={destaques}
          desafios={desafios}
          pendencias={pendencias}
          proximosMeses={proximosMeses}
          observacoes={observacoes}
          jaPublicado={registro?.status === "publicado"}
        />
      ) : (
        <VisualizacaoRegistro
          metas={metas}
          destaques={destaques}
          desafios={desafios}
          pendencias={pendencias}
          proximosMeses={proximosMeses}
          observacoes={observacoes}
          status={registro?.status ?? "rascunho"}
        />
      )}
    </div>
  );
}

/* ─── Visualização (modo leitura) ─────────────────────────── */

function VisualizacaoRegistro({ metas, destaques, desafios, pendencias, proximosMeses, observacoes, status }: {
  metas: MetaItem[];
  destaques: string[];
  desafios: string[];
  pendencias: string[];
  proximosMeses: string[];
  observacoes: string;
  status: string;
}) {
  return (
    <div className="space-y-4">
      {/* Metas */}
      <SecaoCard titulo="Metas vs Realizado">
        <div className="space-y-3">
          {metas.map((m) => {
            const pct = m.meta > 0 ? Math.round((m.realizado / m.meta) * 100) : 0;
            const ok = pct >= 90;
            const aviso = pct >= 70 && pct < 90;
            const cor = ok ? "#15803D" : aviso ? "#C8952A" : "#B91C1C";
            const bgCor = ok ? "rgba(21,128,61,0.08)" : aviso ? "rgba(200,149,42,0.1)" : "rgba(185,28,28,0.07)";
            return (
              <div key={m.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="text-xs font-medium" style={{ color: "#2C1810" }}>{m.label}</span>
                    <span className="text-xs ml-2" style={{ color: "#B8A898" }}>{m.fonte}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: "#9A8570" }}>
                      {m.realizado.toLocaleString("pt-BR")} / {m.meta.toLocaleString("pt-BR")} {m.unidade}
                    </span>
                    <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: bgCor, color: cor }}>
                      {pct}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full" style={{ backgroundColor: "#F0E8DD" }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: cor }} />
                </div>
              </div>
            );
          })}
        </div>
      </SecaoCard>

      <div className="grid grid-cols-2 gap-4">
        <BulletCard titulo="Destaques do mês" itens={destaques} cor="#15803D" />
        <BulletCard titulo="Desafios" itens={desafios} cor="#B91C1C" />
        <BulletCard titulo="Pendências" itens={pendencias} cor="#C8952A" />
        <BulletCard titulo="Próximos meses" itens={proximosMeses} cor="#6B5744" />
      </div>

      {observacoes && (
        <SecaoCard titulo="Observações gerais">
          <p className="text-sm whitespace-pre-wrap" style={{ color: "#6B5744" }}>{observacoes}</p>
        </SecaoCard>
      )}
    </div>
  );
}

function SecaoCard({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl p-4" style={{ border: "1px solid #E8DDD0" }}>
      <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#9A8570" }}>{titulo}</p>
      {children}
    </div>
  );
}

function BulletCard({ titulo, itens, cor }: { titulo: string; itens: string[]; cor: string }) {
  return (
    <div className="bg-white rounded-xl p-4" style={{ border: "1px solid #E8DDD0" }}>
      <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#9A8570" }}>{titulo}</p>
      {itens.length === 0 ? (
        <p className="text-xs" style={{ color: "#B8A898" }}>Nenhum item registrado</p>
      ) : (
        <ul className="space-y-1.5">
          {itens.map((item, i) => (
            <li key={i} className="flex gap-2 text-xs" style={{ color: "#6B5744" }}>
              <span style={{ color: cor, marginTop: 1 }}>●</span> {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
