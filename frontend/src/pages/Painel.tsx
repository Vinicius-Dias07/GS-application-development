import { useState } from "react";
import { useAuth } from "../context/auth-context";
import Apresentacao from "../components/Apresentacao";
import Plantios from "./Plantios";
import Indicadores from "./Indicadores";

type Aba = "inicio" | "plantios" | "indicadores";

const ABAS: { id: Aba; rotulo: string }[] = [
  { id: "inicio", rotulo: "Início" },
  { id: "plantios", rotulo: "Plantios" },
  { id: "indicadores", rotulo: "Indicadores" },
];

export default function Painel() {
  const { usuario, sair } = useAuth();
  const [aba, setAba] = useState<Aba>("inicio");

  return (
    <main className="largo">
      <header className="topo">
        <span className="marca">🌱 Painel de Plantio</span>
        <span className="saudacao">Olá, {usuario?.nome}</span>
        <button type="button" className="secundario" onClick={sair}>
          Sair
        </button>
      </header>
      <nav className="abas">
        {ABAS.map((a) => (
          <button
            key={a.id}
            type="button"
            className={a.id === aba ? "secundario ativa" : "secundario"}
            onClick={() => setAba(a.id)}
          >
            {a.rotulo}
          </button>
        ))}
      </nav>
      {aba === "inicio" && <Apresentacao />}
      {aba === "plantios" && <Plantios />}
      {aba === "indicadores" && <Indicadores />}
    </main>
  );
}
