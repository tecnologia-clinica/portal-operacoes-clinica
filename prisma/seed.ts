import { PrismaClient } from "../app/generated/prisma";
import { hash } from "bcryptjs";

const db = new PrismaClient();

const SETORES = [
  { nome: "Comercial", descricao: "Funil de captação, atendimento ao lead e conversão" },
  { nome: "Marketing", descricao: "Tráfego pago, conteúdo e aquisição de leads" },
  { nome: "Clínico / Cirúrgico", descricao: "Agenda, ocupação e procedimentos" },
  { nome: "Atendimento", descricao: "Recepção, agendamento e NPS" },
  { nome: "Pós-operatório", descricao: "Protocolos pós-op, satisfação e retorno" },
];

async function main() {
  // Setores
  for (const setor of SETORES) {
    await db.setor.upsert({
      where: { nome: setor.nome },
      update: {},
      create: setor,
    });
  }
  console.log("✓ 5 setores criados");

  // Usuário dono inicial
  const senha = await hash("senha123", 12);
  await db.usuario.upsert({
    where: { email: "jose@clinicacury.com.br" },
    update: {},
    create: {
      nome: "Dr. José Salim Cury",
      email: "jose@clinicacury.com.br",
      senha,
      papel: "DONO",
    },
  });
  console.log("✓ Usuário dono criado: jose@clinicacury.com.br / senha123");
  console.log("  ⚠️  Troque a senha imediatamente após o primeiro login.");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
