import bcrypt from "bcryptjs";
import { Usuario } from "../models/usuario";
import { AppError } from "../errors/AppError";

const NOME_MAX = 100;
const EMAIL_MAX = 254;
const SENHA_MAX = 72; // limite do bcrypt: bytes além disso são ignorados

interface DadosCadastro {
  nome?: string;
  email?: string;
  senha?: string;
}

export async function cadastrar({ nome, email, senha }: DadosCadastro) {
  if (!nome?.trim() || !email?.trim() || !senha) {
    throw new AppError("Nome, e-mail e senha são obrigatórios");
  }
  if (nome.length > NOME_MAX) {
    throw new AppError(`O nome deve ter no máximo ${NOME_MAX} caracteres`);
  }
  if (email.length > EMAIL_MAX) {
    throw new AppError(`O e-mail deve ter no máximo ${EMAIL_MAX} caracteres`);
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new AppError("E-mail inválido");
  }
  if (senha.length < 6) {
    throw new AppError("A senha deve ter ao menos 6 caracteres");
  }
  if (senha.length > SENHA_MAX) {
    throw new AppError(`A senha deve ter no máximo ${SENHA_MAX} caracteres`);
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
  if (email.length > EMAIL_MAX || senha.length > SENHA_MAX) {
    throw new AppError("E-mail ou senha incorretos", 401);
  }

  const usuario = await Usuario.findOne({ email: email.toLowerCase().trim() });
  const senhaConfere = usuario ? await bcrypt.compare(senha, usuario.senhaHash) : false;
  if (!usuario || !senhaConfere) {
    throw new AppError("E-mail ou senha incorretos", 401);
  }

  return { id: usuario.id, nome: usuario.nome, email: usuario.email };
}
