import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { db } from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const usuario = await db.usuario.findUnique({ where: { email } });
        if (!usuario) return null;

        const senhaOk = await compare(password, usuario.senha);
        if (!senhaOk) return null;

        return {
          id: usuario.id,
          name: usuario.nome,
          email: usuario.email,
          papel: usuario.papel,
          setorId: usuario.setorId,
        };
      },
    }),
    Google,
  ],
  callbacks: {
    async signIn({ account, user }) {
      // Login social é só um método de autenticação alternativo — o acesso
      // continua por convite: só entra quem o Admin já cadastrou com esse
      // e-mail Google em Usuario.googleEmail.
      if (account?.provider === "google") {
        if (!user.email) return false;
        const usuario = await db.usuario.findUnique({
          where: { googleEmail: user.email.toLowerCase() },
        });
        return usuario !== null;
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account?.provider === "google" && user?.email) {
        const usuario = await db.usuario.findUnique({
          where: { googleEmail: user.email.toLowerCase() },
        });
        if (usuario) {
          token.sub = usuario.id;
          token.name = usuario.nome;
          token.papel = usuario.papel;
          token.setorId = usuario.setorId;
        }
      } else if (user) {
        token.papel = (user as any).papel;
        token.setorId = (user as any).setorId;
      }
      return token;
    },
    async session({ session, token }) {
      if (!token.sub) throw new Error("Token sem sub — sessão inválida");
      session.user.id = token.sub;
      if (token.name) session.user.name = token.name;
      (session.user as any).papel = token.papel;
      (session.user as any).setorId = token.setorId;
      return session;
    },
  },
});
