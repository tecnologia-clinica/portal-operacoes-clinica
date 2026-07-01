"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha]     = useState("");
  const [erro, setErro]       = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    const res = await signIn("credentials", {
      email: usuario,
      password: senha,
      redirect: false,
    });

    setCarregando(false);

    if (res?.error) {
      setErro("Usuário ou senha incorretos.");
    } else {
      router.push("/");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F7F3EE" }}>
      <div className="w-full max-w-sm bg-white rounded-2xl p-8" style={{ border: "1px solid #E8DDD0", boxShadow: "0 2px 16px rgba(44,24,16,0.06)" }}>
        <div className="mb-8 flex flex-col items-center">
          <Image
            src="/brand/logo-preto-completo.png"
            alt="Dr. José Salim Cury"
            width={200}
            height={100}
            className="object-contain mb-3"
            priority
          />
          <p className="text-xs" style={{ color: "#9A8570" }}>Portal de Operações · acesso interno</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#6B5744" }}>Usuário</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              autoComplete="username"
              placeholder="seu usuário"
              className="w-full text-sm px-3 py-2.5 rounded-lg"
              style={{ border: "1px solid #E8DDD0", color: "#2C1810", backgroundColor: "#FAFAF8", outline: "none" }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#6B5744" }}>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full text-sm px-3 py-2.5 rounded-lg"
              style={{ border: "1px solid #E8DDD0", color: "#2C1810", backgroundColor: "#FAFAF8", outline: "none" }}
            />
          </div>

          {erro && (
            <p className="text-xs px-3 py-2 rounded-lg" style={{ color: "#B91C1C", backgroundColor: "rgba(185,28,28,0.06)" }}>
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full py-2.5 text-white text-sm font-medium rounded-lg transition-opacity"
            style={{ backgroundColor: carregando ? "#D4B87A" : "#C8952A" }}
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
