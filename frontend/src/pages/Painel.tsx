import { useAuth } from "../context/auth-context";

// Tela provisória: será substituída pelo painel de plantios
export default function Painel() {
  const { usuario, sair } = useAuth();

  return (
    <main>
      <h1>Olá, {usuario?.nome}</h1>
      <p>Você está logado como {usuario?.email}.</p>
      <button type="button" onClick={sair}>
        Sair
      </button>
    </main>
  );
}
