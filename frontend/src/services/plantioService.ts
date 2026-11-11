import { requisitar } from "./api";

export const CULTURAS = [
  { valor: "mandioca", rotulo: "Mandioca" },
  { valor: "feijao", rotulo: "Feijão" },
  { valor: "milho", rotulo: "Milho" },
  { valor: "alface", rotulo: "Alface" },
  { valor: "tomate", rotulo: "Tomate" },
  { valor: "batata-doce", rotulo: "Batata-doce" },
  { valor: "abobora", rotulo: "Abóbora" },
  { valor: "cenoura", rotulo: "Cenoura" },
  { valor: "couve", rotulo: "Couve" },
  { valor: "quiabo", rotulo: "Quiabo" },
] as const;

export function rotuloCultura(valor: string): string {
  return CULTURAS.find((c) => c.valor === valor)?.rotulo ?? valor;
}

export interface Plantio {
  id: string;
  cultura: string;
  dataPlantio: string;
  areaM2: number;
  quantidadeMudas: number | null;
  dataColheita: string;
  producaoEsperadaKg: number;
  retornoEstimado: number;
  status: string;
}

export interface NovoPlantio {
  cultura: string;
  dataPlantio: string;
  area: number;
  unidade: "m2" | "ha";
  quantidadeMudas?: number;
}

export interface Indicadores {
  total: number;
  porCultura: Record<string, number>;
  porStatus: Record<string, number>;
  producaoTotalKg: number;
  retornoTotal: number;
  aviso: string;
}

export function listarPlantios() {
  return requisitar<Plantio[]>("/plantios");
}

export function criarPlantio(dados: NovoPlantio) {
  return requisitar<Plantio>("/plantios", { metodo: "POST", corpo: dados });
}

export function buscarIndicadores() {
  return requisitar<Indicadores>("/plantios/indicadores");
}
