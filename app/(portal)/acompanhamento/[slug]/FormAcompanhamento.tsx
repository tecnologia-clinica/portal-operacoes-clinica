"use client";

import { useRef } from "react";
import type { MetaItem } from "@/app/actions/acompanhamento";

type Props = {
  slug: string;
  action: (formData: FormData) => Promise<void>;
  metas: MetaItem[];
  destaques: string[];
  desafios: string[];
  pendencias: string[];
  proximosMeses: string[];
  observacoes: string;
  jaPublicado: boolean;
};

export default function FormAcompanhamento({
  action, metas, destaques, desafios, pendencias, proximosMeses, observacoes, jaPublicado,
}: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={action} className="space-y-4">

      {/* Metas vs Realizado */}
      <div className="bg-white rounded-xl p-4" style={{ border: "1px solid #E8DDD0" }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#9A8570" }}>
          Metas vs Realizado
        </p>
        <div className="space-y-3">
          {metas.map((m, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <input type="hidden" name="meta_label"   value={m.label}   />
              <input type="hidden" name="meta_meta"    value={m.meta}    />
              <input type="hidden" name="meta_unidade" value={m.unidade} />
              <input type="hidden" name="meta_fonte"   value={m.fonte}   />

              <div className="col-span-4">
                <p className="text-xs font-medium" style={{ color: "#2C1810" }}>{m.label}</p>
                <p className="text-xs" style={{ color: "#B8A898" }}>Meta: {m.meta.toLocaleString("pt-BR")} {m.unidade} · {m.fonte}</p>
              </div>

              <div className="col-span-3 flex items-center gap-1">
                <input
                  type="number"
                  name="meta_real"
                  defaultValue={m.realizado}
                  step="any"
                  className="w-full text-sm px-2.5 py-1.5 rounded-lg"
                  style={{ border: "1px solid #E8DDD0", color: "#2C1810", backgroundColor: "#FAFAF8" }}
                />
                <span className="text-xs shrink-0" style={{ color: "#9A8570" }}>{m.unidade}</span>
              </div>

              <div className="col-span-5">
                {(() => {
                  const pct = m.meta > 0 ? Math.round((m.realizado / m.meta) * 100) : 0;
                  const cor = pct >= 90 ? "#15803D" : pct >= 70 ? "#C8952A" : "#B91C1C";
                  return (
                    <div>
                      <div className="flex justify-between text-xs mb-1" style={{ color: "#9A8570" }}>
                        <span>0</span><span style={{ color: cor }}>{pct}%</span><span>{m.meta.toLocaleString("pt-BR")}</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ backgroundColor: "#F0E8DD" }}>
                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: cor }} />
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seções de texto */}
      <div className="grid grid-cols-2 gap-4">
        <TextareaSecao name="destaques"     label="Destaques do mês"  placeholder="Uma conquista por linha..." defaultValue={destaques.join("\n")}     cor="#15803D" />
        <TextareaSecao name="desafios"      label="Desafios"          placeholder="Um desafio por linha..."   defaultValue={desafios.join("\n")}      cor="#B91C1C" />
        <TextareaSecao name="pendencias"    label="Pendências"        placeholder="Uma pendência por linha..." defaultValue={pendencias.join("\n")}    cor="#C8952A" />
        <TextareaSecao name="proximosMeses" label="Próximos meses"    placeholder="Uma ação por linha..."     defaultValue={proximosMeses.join("\n")} cor="#6B5744" />
      </div>

      {/* Observações */}
      <div className="bg-white rounded-xl p-4" style={{ border: "1px solid #E8DDD0" }}>
        <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: "#9A8570" }}>
          Observações gerais
        </label>
        <textarea
          name="observacoes"
          defaultValue={observacoes}
          rows={3}
          placeholder="Contexto adicional, decisões tomadas, notas livres..."
          className="w-full text-sm px-3 py-2 rounded-lg resize-none"
          style={{ border: "1px solid #E8DDD0", color: "#2C1810", backgroundColor: "#FAFAF8" }}
        />
      </div>

      {/* Ações */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          name="publicar"
          value="0"
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: "#F0E8DD", color: "#6B5744" }}
        >
          Salvar rascunho
        </button>
        <button
          type="submit"
          name="publicar"
          value="1"
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: "#C8952A", color: "#fff" }}
        >
          {jaPublicado ? "Atualizar" : "Publicar"}
        </button>
        <p className="text-xs ml-auto" style={{ color: "#B8A898" }}>
          Um item por linha nos campos de texto
        </p>
      </div>
    </form>
  );
}

function TextareaSecao({ name, label, placeholder, defaultValue, cor }: {
  name: string; label: string; placeholder: string; defaultValue: string; cor: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4" style={{ border: "1px solid #E8DDD0" }}>
      <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: "#9A8570" }}>
        <span style={{ color: cor }}>●</span> {label}
      </label>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={4}
        placeholder={placeholder}
        className="w-full text-sm px-3 py-2 rounded-lg resize-none"
        style={{ border: "1px solid #E8DDD0", color: "#2C1810", backgroundColor: "#FAFAF8" }}
      />
    </div>
  );
}
