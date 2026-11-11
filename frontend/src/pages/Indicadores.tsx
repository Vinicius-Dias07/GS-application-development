import { useEffect, useState } from "react";
import { buscarIndicadores, rotuloCultura, type Indicadores } from "../services/plantioService";
import { formatarMoeda, formatarNumero } from "../lib/formatar";

export default function IndicadoresPagina() {
  const [dados, setDados] = useState<Indicadores | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    buscarIndicadores()
      .then(setDados)
      .catch((e) => setErro(e instanceof Error ? e.message : "Erro inesperado"));
  }, []);

  if (erro) return <p className="erro">{erro}</p>;
  if (!dados) return <p>Carregando...</p>;

  return (
    <section>
      <h2>Indicadores</h2>
      <p className="aviso">{dados.aviso}</p>

      <div className="cartoes">
        <div className="cartao">
          <span>Total de plantios</span>
          <strong>{dados.total}</strong>
        </div>
        <div className="cartao">
          <span>Produção esperada</span>
          <strong>{formatarNumero(dados.producaoTotalKg)} kg</strong>
        </div>
        <div className="cartao">
          <span>Retorno estimado</span>
          <strong>{formatarMoeda(dados.retornoTotal)}</strong>
        </div>
      </div>

      <h3>Plantios por cultura</h3>
      {Object.keys(dados.porCultura).length === 0 ? (
        <p>Nenhum plantio registrado.</p>
      ) : (
        <ul>
          {Object.entries(dados.porCultura).map(([cultura, qtd]) => (
            <li key={cultura}>
              {rotuloCultura(cultura)}: <strong>{qtd}</strong>
            </li>
          ))}
        </ul>
      )}

      <h3>Plantios por status da safra</h3>
      <ul>
        {Object.entries(dados.porStatus).map(([status, qtd]) => (
          <li key={status}>
            {status}: <strong>{qtd}</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}
