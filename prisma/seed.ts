import "dotenv/config";
import { Pool } from "pg";
import { hash } from "bcryptjs";
import { randomUUID } from "crypto";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const SETORES = [
  { nome: "Comercial", descricao: "Funil de captação, atendimento ao lead e conversão" },
  { nome: "Marketing", descricao: "Tráfego pago, conteúdo e aquisição de leads" },
  { nome: "Clínico / Cirúrgico", descricao: "Agenda, ocupação e procedimentos" },
  { nome: "Atendimento", descricao: "Recepção, agendamento e NPS" },
  { nome: "Pós-operatório", descricao: "Protocolos pós-op, satisfação e retorno" },
];

async function main() {
  const client = await pool.connect();
  try {
    // Setores
    for (const s of SETORES) {
      await client.query(
        `INSERT INTO "Setor" (id, nome, descricao)
         VALUES ($1, $2, $3)
         ON CONFLICT (nome) DO NOTHING`,
        [randomUUID(), s.nome, s.descricao]
      );
    }
    console.log("✓ 5 setores criados");

    // Usuário dono inicial
    const senha = await hash("senha123", 12);
    await client.query(
      `INSERT INTO "Usuario" (id, nome, email, senha, papel, "criadoEm")
       VALUES ($1, $2, $3, $4, $5, now())
       ON CONFLICT (email) DO NOTHING`,
      [randomUUID(), "Dr. José Salim Cury", "jose@clinicacury.com.br", senha, "DONO"]
    );
    console.log("✓ Usuário dono criado: jose@clinicacury.com.br / senha123");
    console.log("  ⚠️  Troque a senha imediatamente após o primeiro login.");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
