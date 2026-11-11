import type { Cultura } from "../models/plantio";

// DADOS SIMULADOS: valores aproximados, criados apenas para fins didáticos.
export interface Referencia {
  cicloDias: number; // do plantio à colheita
  produtividadeKgM2: number; // kg colhidos por m²
  precoKg: number; // R$ por kg
}

export const REFERENCIA: Record<Cultura, Referencia> = {
  mandioca: { cicloDias: 300, produtividadeKgM2: 1.5, precoKg: 2.0 },
  feijao: { cicloDias: 90, produtividadeKgM2: 0.25, precoKg: 7.0 },
  milho: { cicloDias: 120, produtividadeKgM2: 0.5, precoKg: 1.5 },
  alface: { cicloDias: 60, produtividadeKgM2: 2.0, precoKg: 4.0 },
  tomate: { cicloDias: 110, produtividadeKgM2: 4.0, precoKg: 4.5 },
  "batata-doce": { cicloDias: 120, produtividadeKgM2: 2.0, precoKg: 3.0 },
  abobora: { cicloDias: 110, produtividadeKgM2: 2.5, precoKg: 2.5 },
  cenoura: { cicloDias: 100, produtividadeKgM2: 3.0, precoKg: 3.5 },
  couve: { cicloDias: 75, produtividadeKgM2: 1.5, precoKg: 4.0 },
  quiabo: { cicloDias: 90, produtividadeKgM2: 1.2, precoKg: 6.0 },
};
