import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  const usuario = await db.usuario.findUnique({
    where: { id: session.user.id },
    select: { nome: true, papel: true },
  });

  const user = {
    ...session.user,
    name: usuario?.nome ?? session.user.name,
    papel: usuario?.papel ?? (session.user as any).papel,
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar user={user} />
        <main className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: "#F7F3EE" }}>{children}</main>
      </div>
    </div>
  );
}
