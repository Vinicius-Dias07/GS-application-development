import { CULTURAS, Plantio, type Cultura, type IPlantio } from "../models/plantio";
import { AppError } from "../errors/AppError";
import { REFERENCIA } from "./referenciaCulturas";

const M2_POR_HA = 10_000;
const AREA_MAX_M2 = 1_000_000; // 100 ha: teto para evitar valores absurdos
const MUDAS_MAX = 1_000_000;
const DIA_MS = 24 * 60 * 60 * 1000;

// Regras de status (decisão do projeto, derivadas apenas das datas):
const DIAS_COLHEITA_PROXIMA = 7; // últimos 7 dias antes da colheita
const DIAS_PRONTO = 14; // janela de colheita; depois disso, considerado colhido

export const STATUS = ["plantado", "colheita próxima", "pronto para colher", "colhido"] as const;
export type Status = (typeof STATUS)[number];

interface DadosPlantio {
  cultura?: string;
  dataPlantio?: string;
  area?: number | string;
  unidade?: string;
  quantidadeMudas?: number | string | null;
}

export async function criar(agricultorId: string, dados: DadosPlantio) {
  const { cultura, dataPlantio, unidade } = dados;

  if (!cultura || !(CULTURAS as readonly string[]).includes(cultura)) {
    throw new AppError("Cultura inválida");
  }
  if (!dataPlantio || Number.isNaN(Date.parse(dataPlantio))) {
    throw new AppError("Data de plantio inválida");
  }
  if (unidade !== "m2" && unidade !== "ha") {
    throw new AppError("Unidade de área deve ser 'm2' ou 'ha'");
  }

  const area = Number(dados.area);
  if (!Number.isFinite(area) || area <= 0) {
    throw new AppError("A área deve ser um número maior que zero");
  }
  const areaM2 = unidade === "ha" ? area * M2_POR_HA : area;
  if (areaM2 > AREA_MAX_M2) {
    throw new AppError("A área máxima aceita é 100 ha (1.000.000 m²)");
  }

  let quantidadeMudas: number | undefined;
  if (dados.quantidadeMudas !== undefined && dados.quantidadeMudas !== null && dados.quantidadeMudas !== "") {
    quantidadeMudas = Number(dados.quantidadeMudas);
    if (!Number.isInteger(quantidadeMudas) || quantidadeMudas < 1 || quantidadeMudas > MUDAS_MAX) {
      throw new AppError(`A quantidade de mudas deve ser um inteiro entre 1 e ${MUDAS_MAX}`);
    }
  }

  const plantio = await Plantio.create({
    agricultor: agricultorId,
    cultura: cultura as Cultura,
    dataPlantio: new Date(dataPlantio),
    areaM2,
    quantidadeMudas,
  });
  return comPrevisao(plantio);
}

export async function listar(agricultorId: string) {
  const plantios = await Plantio.find({ agricultor: agricultorId }).sort({ dataPlantio: -1 });
  return plantios.map((p) => comPrevisao(p));
}

export async function indicadores(agricultorId: string) {
  const plantios = await listar(agricultorId);

  const porCultura: Record<string, number> = {};
  const porStatus: Record<string, number> = Object.fromEntries(STATUS.map((s) => [s, 0]));
  let producaoTotalKg = 0;
  let retornoTotal = 0;

  for (const p of plantios) {
    porCultura[p.cultura] = (porCultura[p.cultura] ?? 0) + 1;
    porStatus[p.status] += 1;
    producaoTotalKg += p.producaoEsperadaKg;
    retornoTotal += p.retornoEstimado;
  }

  return {
    total: plantios.length,
    porCultura,
    porStatus,
    producaoTotalKg: arredondar(producaoTotalKg),
    retornoTotal: arredondar(retornoTotal),
    aviso: "Valores estimados com base em dados de referência simulados.",
  };
}

// A previsão é calculada na leitura (não é gravada): se a tabela de
// referência mudar, todos os plantios refletem a mudança.
function comPrevisao(p: IPlantio & { id: string }, hoje: Date = new Date()) {
  const ref = REFERENCIA[p.cultura];
  const dataColheita = new Date(p.dataPlantio.getTime() + ref.cicloDias * DIA_MS);
  const producaoEsperadaKg = p.areaM2 * ref.produtividadeKgM2;

  return {
    id: p.id,
    cultura: p.cultura,
    dataPlantio: p.dataPlantio,
    areaM2: p.areaM2,
    quantidadeMudas: p.quantidadeMudas ?? null,
    dataColheita,
    producaoEsperadaKg: arredondar(producaoEsperadaKg),
    retornoEstimado: arredondar(producaoEsperadaKg * ref.precoKg),
    status: calcularStatus(dataColheita, hoje),
  };
}

function calcularStatus(dataColheita: Date, hoje: Date): Status {
  const diasAteColheita = (dataColheita.getTime() - hoje.getTime()) / DIA_MS;
  if (diasAteColheita > DIAS_COLHEITA_PROXIMA) return "plantado";
  if (diasAteColheita > 0) return "colheita próxima";
  if (diasAteColheita > -DIAS_PRONTO) return "pronto para colher";
  return "colhido";
}

function arredondar(n: number): number {
  return Math.round(n * 100) / 100;
}
