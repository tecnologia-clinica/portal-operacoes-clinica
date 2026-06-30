const CONFIG = {
  APROVADO:   { label: "Aprovado",    className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  EM_REVISAO: { label: "Em revisão",  className: "bg-amber-50 text-amber-700 border-amber-200" },
  RASCUNHO:   { label: "Rascunho",    className: "bg-slate-100 text-slate-500 border-slate-200" },
};

export default function BadgeStatus({ status }: { status: string }) {
  const cfg = CONFIG[status as keyof typeof CONFIG] ?? CONFIG.RASCUNHO;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}
