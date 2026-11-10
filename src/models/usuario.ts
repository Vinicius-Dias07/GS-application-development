import { Schema, model } from "mongoose";

export interface IUsuario {
  nome: string;
  email: string;
  senhaHash: string;
}

const usuarioSchema = new Schema<IUsuario>(
  {
    nome: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    senhaHash: { type: String, required: true },
  },
  { timestamps: true }
);

export const Usuario = model<IUsuario>("Usuario", usuarioSchema);
