import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
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
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.papel = (user as any).papel;
        token.setorId = (user as any).setorId;
      }
      return token;
    },
    async session({ session, token }) {
      if (!token.sub) throw new Error("Token sem sub — sessão inválida");
      session.user.id = token.sub;
      (session.user as any).papel = token.papel;
      (session.user as any).setorId = token.setorId;
      return session;
    },
  },
});
