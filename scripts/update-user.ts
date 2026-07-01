import { hash } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma";
import "dotenv/config";

async function run() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const db = new PrismaClient({ adapter });
  const senha = await hash("feliz1234", 12);
  const u = await db.usuario.update({
    where: { email: "jose@clinicacury.com.br" },
    data: { email: "thales@clinicacury.com.br", nome: "Thales", senha },
  });
  console.log("Atualizado:", u.email, u.nome);
  await db.$disconnect();
}

run().catch(console.error);
