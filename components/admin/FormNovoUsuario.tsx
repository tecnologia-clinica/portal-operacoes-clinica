"use client";

import { useState, useRef } from "react";
import { criarUsuario } from "@/app/actions/admin";

const PAPEIS = [
  { value: "OPERACAO", label: "Operação" },
  { value: "LIDER",    label: "Líder" },
  { value: "GESTAO",   label: "Gestão" },
  { value: "DONO",     label: "Dono" },
];

type Setor = { id: string; nome: string };

export default function FormNovoUsuario({ setores }: { setores: Setor[] }) {
  const [aberto, setAberto] = useState(false);
  const [erro, setErro]     = useState("");
  const [ok, setOk]         = useState(false);
  const [salvando, setSalvando] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setSalvando(true);
    setErro("");
    setOk(false);
    try {
      await criarUsuario(formData);
      setOk(true);
      formRef.current?.reset();
      setTimeout(() => { setAberto(false); setOk(false); }, 1500);
    } catch (e: any) {
      setErro(e.message ?? "Erro ao criar usuário");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="mb-6">
      {!aberto ? (
        <button
          onClick={() => setAberto(true)}
          className="px-4 py-2 rounded-lg text-sm font-medium"
          style={{ backgroundColor: "#C8952A", color: "#fff" }}
        >
          + Novo usuário
        </button>
      ) : (
        <div className="bg-white rounded-xl p-5" style={{ border: "1px solid #E8DDD0" }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold" style={{ color: "#2C1810" }}>Novo usuário</p>
            <button onClick={() => { setAberto(false); setErro(""); }} className="text-xs" style={{ color: "#9A8570" }}>
              Cancelar
            </button>
          </div>

          <form ref={formRef} action={handleSubmit} className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "#6B5744" }}>Nome *</label>
              <input
                name="nome" type="text" required placeholder="Nome completo"
                className="w-full text-sm px-3 py-2 rounded-lg"
                style={{ border: "1px solid #E8DDD0", color: "#2C1810", backgroundColor: "#FAFAF8" }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "#6B5744" }}>Email *</label>
              <input
                name="email" type="email" required placeholder="email@clinicacury.com.br"
                className="w-full text-sm px-3 py-2 rounded-lg"
                style={{ border: "1px solid #E8DDD0", color: "#2C1810", backgroundColor: "#FAFAF8" }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "#6B5744" }}>Senha *</label>
              <input
                name="senha" type="password" required placeholder="Mínimo 6 caracteres"
                className="w-full text-sm px-3 py-2 rounded-lg"
                style={{ border: "1px solid #E8DDD0", color: "#2C1810", backgroundColor: "#FAFAF8" }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "#6B5744" }}>Perfil *</label>
              <select
                name="papel" required
                className="w-full text-sm px-3 py-2 rounded-lg"
                style={{ border: "1px solid #E8DDD0", color: "#2C1810", backgroundColor: "#FAFAF8" }}
              >
                {PAPEIS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: "#6B5744" }}>Setor (opcional)</label>
              <select
                name="setorId"
                className="w-full text-sm px-3 py-2 rounded-lg"
                style={{ border: "1px solid #E8DDD0", color: "#2C1810", backgroundColor: "#FAFAF8" }}
              >
                <option value="">— Sem setor —</option>
                {setores.map((s) => (
                  <option key={s.id} value={s.id}>{s.nome}</option>
                ))}
              </select>
            </div>

            {erro && (
              <div className="col-span-2 px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: "rgba(185,28,28,0.06)", color: "#B91C1C" }}>
                {erro}
              </div>
            )}

            {ok && (
              <div className="col-span-2 px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: "rgba(21,128,61,0.06)", color: "#15803D" }}>
                ✓ Usuário criado com sucesso
              </div>
            )}

            <div className="col-span-2 flex gap-2 pt-1">
              <button
                type="submit"
                disabled={salvando}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: salvando ? "#D4B87A" : "#C8952A", color: "#fff" }}
              >
                {salvando ? "Criando..." : "Criar usuário"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
