import bcrypt from "bcryptjs";
import { Usuario } from "../models/usuario";
import { AppError } from "../errors/AppError";

interface DadosCadastro {
  nome?: string;
  email?: string;
  senha?: string;
}

export async function cadastrar({ nome, email, senha }: DadosCadastro) {
  if (!nome?.trim() || !email?.trim() || !senha) {
    throw new AppError("Nome, e-mail e senha são obrigatórios");
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new AppError("E-mail inválido");
  }
  if (senha.length < 6) {
    throw new AppError("A senha deve ter ao menos 6 caracteres");
  }

  const existente = await Usuario.findOne({ email: email.toLowerCase().trim() });
  if (existente) {
    throw new AppError("E-mail já cadastrado", 409);
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  const usuario = await Usuario.create({ nome, email, senhaHash });
  return { id: usuario.id, nome: usuario.nome, email: usuario.email };
}

export async function entrar(email?: string, senha?: string) {
  if (!email || !senha) {
    throw new AppError("E-mail e senha são obrigatórios");
  }

  const usuario = await Usuario.findOne({ email: email.toLowerCase().trim() });
  const senhaConfere = usuario ? await bcrypt.compare(senha, usuario.senhaHash) : false;
  if (!usuario || !senhaConfere) {
    throw new AppError("E-mail ou senha incorretos", 401);
  }

  return { id: usuario.id, nome: usuario.nome, email: usuario.email };
}
