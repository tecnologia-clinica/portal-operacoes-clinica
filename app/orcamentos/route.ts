import { auth } from "@/auth";
import { podeAcessarOrcamentos } from "@/lib/roles";
import { readFile } from "fs/promises";
import path from "path";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Não autorizado", { status: 401 });
  }

  const papel = (session.user as any).papel as string;
  if (!podeAcessarOrcamentos(papel)) {
    return new Response("Sem permissão para acessar o Gerador de Orçamentos", { status: 403 });
  }

  const html = await readFile(
    path.join(process.cwd(), "lib/orcamentos/gerador-orcamentos.html"),
    "utf-8"
  );

  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
