import { requisitar } from "./api";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
}

export function entrar(email: string, senha: string) {
  return requisitar<Usuario>("/auth/login", {
    metodo: "POST",
    corpo: { email, senha },
  });
}

export function cadastrar(nome: string, email: string, senha: string) {
  return requisitar<Usuario>("/auth/cadastro", {
    metodo: "POST",
    corpo: { nome, email, senha },
  });
}