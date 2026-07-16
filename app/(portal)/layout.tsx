import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import PortalShell from "@/components/layout/PortalShell";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const usuario = await db.usuario.findUnique({
    where: { id: session.user.id },
    select: { nome: true, papel: true },
  });

  if (!usuario) redirect("/login");

  const user = {
    ...session.user,
    name: usuario.nome,
    papel: usuario.papel,
  };

  return (
    <PortalShell papel={usuario.papel} user={user}>
      {children}
    </PortalShell>
  );
}
