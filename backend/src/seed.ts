import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDatabase } from "./config/database";
import { Usuario } from "./models/usuario";
import { Plantio } from "./models/plantio";

// Cria (ou recria) um agricultor de demonstração com plantios em vários status.
// Uso: npm run seed   (dentro de backend/)
const EMAIL = "demo@agro.com";
const SENHA = "demo123";
const DIA_MS = 24 * 60 * 60 * 1000;

function diasAtras(dias: number): Date {
  const d = new Date(Date.now() - dias * DIA_MS);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

async function main() {
  await connectDatabase();

  await Usuario.deleteOne({ email: EMAIL });
  const usuario = await Usuario.create({
    nome: "Agricultor Demo",
    email: EMAIL,
    senhaHash: await bcrypt.hash(SENHA, 10),
  });
  await Plantio.deleteMany({ agricultor: usuario._id });

  // Ciclos: alface 60d, tomate 110d, feijão 90d, milho 120d, cenoura 100d, couve 75d
  await Plantio.insertMany([
    { cultura: "alface", dataPlantio: diasAtras(90), areaM2: 200 }, // colhido
    { cultura: "feijao", dataPlantio: diasAtras(88), areaM2: 1, quantidadeMudas: 300 }, // pronto/colhido
    { cultura: "couve", dataPlantio: diasAtras(70), areaM2: 150 }, // colheita próxima
    { cultura: "tomate", dataPlantio: diasAtras(30), areaM2: 0.5 * 10_000, quantidadeMudas: 2000 }, // plantado
    { cultura: "milho", dataPlantio: diasAtras(10), areaM2: 3000 }, // plantado
    { cultura: "cenoura", dataPlantio: diasAtras(100), areaM2: 400 }, // pronto para colher
  ].map((p) => ({ ...p, agricultor: usuario._id })));

  console.log(`Seed concluído. Login: ${EMAIL} / ${SENHA}`);
}

main()
  .catch((e) => {
    console.error("Falha no seed:", e);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
