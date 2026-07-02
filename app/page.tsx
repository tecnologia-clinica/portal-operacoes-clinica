import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { homeDoUsuario } from "@/lib/roles";

export default async function Home() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const usuario = await db.usuario.findUnique({
    where: { id: session.user.id },
    select: { papel: true },
  });

  redirect(homeDoUsuario(usuario?.papel ?? "GERAL"));
}
