import { useState, type ReactNode } from "react";
import type { Usuario } from "../services/authService";
import { AuthContext } from "./auth-context";

const CHAVE = "usuario";

function lerSalvo(): Usuario | null {
  try {
    const texto = localStorage.getItem(CHAVE);
    return texto ? (JSON.parse(texto) as Usuario) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(lerSalvo);

  function login(novo: Usuario) {
    localStorage.setItem(CHAVE, JSON.stringify(novo));
    setUsuario(novo);
  }

  function sair() {
    localStorage.removeItem(CHAVE);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, login, sair }}>
      {children}
    </AuthContext.Provider>
  );
}
