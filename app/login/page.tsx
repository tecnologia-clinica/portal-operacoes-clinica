"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha]     = useState("");
  const [erro, setErro]       = useState("");
  const [carregando, setCarregando] = useState(false);
  const [carregandoGoogle, setCarregandoGoogle] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "AccessDenied") {
      setErro("Seu e-mail Google ainda não tem acesso liberado. Peça para o Admin cadastrar seu convite.");
    } else if (params.get("error")) {
      setErro("Não foi possível entrar com Google. Tente novamente.");
    }
  }, []);

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

  async function handleGoogle() {
    setErro("");
    setCarregandoGoogle(true);
    await signIn("google", { callbackUrl: "/" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F7F3EE" }}>
      <div className="w-full max-w-sm bg-white rounded-2xl p-8" style={{ border: "1px solid #E8DDD0", boxShadow: "0 2px 16px rgba(44,24,16,0.06)" }}>
        <div className="mb-8 flex flex-col items-center">
          <Image
            src="/brand/logo-dourado-completo.png"
            alt="Dr. José Salim Cury"
            width={280}
            height={140}
            className="object-contain mb-3"
            priority
          />
          <p className="text-sm font-semibold" style={{ color: "#9A8570" }}>Portal de Operações · acesso interno</p>
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

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ backgroundColor: "#E8DDD0" }} />
          <span className="text-xs" style={{ color: "#9A8570" }}>ou</span>
          <div className="flex-1 h-px" style={{ backgroundColor: "#E8DDD0" }} />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={carregandoGoogle}
          className="w-full py-2.5 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-opacity"
          style={{ border: "1px solid #E8DDD0", color: "#2C1810", backgroundColor: "#fff", opacity: carregandoGoogle ? 0.6 : 1 }}
        >
          <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20.4H24v7.2h11.3c-1.6 4.6-6 7.9-11.3 7.9-6.9 0-12.5-5.6-12.5-12.5S17.1 10.5 24 10.5c3.2 0 6 1.2 8.2 3.1l5.4-5.4C34.4 5 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.4-.4-3.5z" />
            <path fill="#FF3D00" d="M6.3 14.7l6 4.4C13.9 15.3 18.6 12.5 24 12.5c3.2 0 6 1.2 8.2 3.1l5.4-5.4C34.4 5 29.5 3 24 3 16.3 3 9.6 7.2 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 45c5.4 0 10.2-1.9 13.9-5.1l-6.4-5.4C29.5 36 26.9 37 24 37c-5.3 0-9.8-3.4-11.3-8.1l-6.2 4.8C9.5 40.6 16.2 45 24 45z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20.4H24v7.2h11.3c-.8 2.3-2.2 4.2-4 5.6l6.4 5.4C41.6 35.4 45 30.2 45 24c0-1.2-.1-2.4-.4-3.5z" />
          </svg>
          {carregandoGoogle ? "Entrando..." : "Entrar com Google"}
        </button>

        <p className="text-xs text-center mt-4" style={{ color: "#B8A898" }}>
          Acesso só por convite — fale com o Admin se precisar de acesso.
        </p>
      </div>
    </div>
  );
}
