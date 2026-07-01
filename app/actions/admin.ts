"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";

async function assertGestao() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Sem permissão");
  const papel = (session.user as any)?.papel;
  if (papel !== "DONO" && papel !== "GESTAO") throw new Error("Sem permissão");
  return session;
}

export async function criarUsuario(formData: FormData) {
  const session = await assertGestao();

  const nome   = (formData.get("nome")   as string).trim();
  const email  = (formData.get("email")  as string).trim().toLowerCase();
  const senha  = (formData.get("senha")  as string);
  const papel  = (formData.get("papel")  as string);
  const setorId = (formData.get("setorId") as string) || null;

  if (!nome || !email || !senha || !papel) throw new Error("Preencha todos os campos obrigatórios");
  if (senha.length < 6) throw new Error("Senha deve ter pelo menos 6 caracteres");

  const existe = await db.usuario.findUnique({ where: { email } });
  if (existe) throw new Error("Email já cadastrado");

  const senhaHash = await hash(senha, 12);

  await db.usuario.create({
    data: { nome, email, senha: senhaHash, papel: papel as any, setorId },
  });

  revalidatePath("/admin");
}

export async function alterarPapel(userId: string, novoPapel: string) {
  const session = await assertGestao();
  const meuId = session.user!.id;

  if (userId === meuId) throw new Error("Você não pode alterar seu próprio perfil");

  await db.usuario.update({
    where: { id: userId },
    data: { papel: novoPapel as any },
  });

  revalidatePath("/admin");
}

export async function removerUsuario(userId: string) {
  const session = await assertGestao();
  const papel = (session?.user as any)?.papel;
  if (papel !== "DONO") throw new Error("Apenas o Dono pode remover usuários");

  if (userId === session.user!.id) throw new Error("Você não pode remover a si mesmo");

  await db.usuario.delete({ where: { id: userId } });

  revalidatePath("/admin");
}
