import { useState } from "react";
import { useAuth } from "./context/auth-context";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Painel from "./pages/Painel";

type Modo = "login" | "cadastro";

function App() {
  const { usuario } = useAuth();
  const [modo, setModo] = useState<Modo>("login");

  // Sem biblioteca de rotas: o estado "usuario" decide entre Painel e telas
  // públicas; o estado "modo" decide qual das telas públicas aparece.
  if (usuario) return <Painel />;

  return modo === "login" ? (
    <Login aoTrocar={() => setModo("cadastro")} />
  ) : (
    <Cadastro aoTrocar={() => setModo("login")} />
  );
}

export default App;
