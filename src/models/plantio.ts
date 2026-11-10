import { Date, Schema, model } from "mongoose";

export const CULTURAS = [
  "mandioca", "feijao", "milho", "alface", "tomate",
  "batata-doce", "abobora", "cenoura", "couve", "quiabo",
] as const;

export type Cultura = (typeof CULTURAS)[number];

export interface IPlantio {
    cultura: Cultura;
    dataPlantio: Date;
    areaM2: number;
    quantidadeMudas?: number;
}

const plantioSchema = new Schema<IPlantio>(
{
    cultura: { type: String, enum: CULTURAS, required:true },
    dataPlantio: { type: Date, required: true },
    areaM2: { type: Number, required: true, min: 0.01 },
    quantidadeMudas: { type: Number, min: 1 },
}, {
    timestamps: true
})

export const Plantio = model<IPlantio>("Plantio", plantioSchema);