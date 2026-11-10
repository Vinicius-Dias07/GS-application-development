import { createContext, useContext } from "react";
import type { Usuario } from "../services/authService";

export interface AuthContextoValor {
  usuario: Usuario | null;
  login: (usuario: Usuario) => void;
  sair: () => void;
}

export const AuthContext = createContext<AuthContextoValor | null>(null);

export function useAuth(): AuthContextoValor {
  const valor = useContext(AuthContext);
  if (!valor) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  }
  return valor;
}
