import { useEffect, useState, type FormEvent } from "react";
import {
  CULTURAS,
  criarPlantio,
  listarPlantios,
  rotuloCultura,
  type Plantio,
} from "../services/plantioService";
import { formatarData, formatarMoeda, formatarNumero } from "../lib/formatar";

const AREA_MAX_HA = 100;

export default function Plantios() {
  const [plantios, setPlantios] = useState<Plantio[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroLista, setErroLista] = useState("");

  const [cultura, setCultura] = useState("");
  const [dataPlantio, setDataPlantio] = useState("");
  const [area, setArea] = useState("");
  const [unidade, setUnidade] = useState<"m2" | "ha">("m2");
  const [mudas, setMudas] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [enviando, setEnviando] = useState(false);

  const [versao, setVersao] = useState(0); // incrementa para recarregar a lista

  useEffect(() => {
    listarPlantios()
      .then((lista) => {
        setPlantios(lista);
        setErroLista("");
      })
      .catch((e) => setErroLista(e instanceof Error ? e.message : "Erro inesperado"))
      .finally(() => setCarregando(false));
  }, [versao]);

  async function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro("");
    setSucesso("");
    setEnviando(true);
    try {
      await criarPlantio({
        cultura,
        dataPlantio,
        area: Number(area),
        unidade,
        quantidadeMudas: mudas ? Number(mudas) : undefined,
      });
      setSucesso("Plantio registrado com sucesso!");
      setCultura("");
      setDataPlantio("");
      setArea("");
      setMudas("");
      setVersao((v) => v + 1);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <section>
        <h2>Novo plantio</h2>
        <form onSubmit={aoEnviar}>
          <label>
            Cultura
            <select value={cultura} onChange={(e) => setCultura(e.target.value)} required>
              <option value="">Selecione...</option>
              {CULTURAS.map((c) => (
                <option key={c.valor} value={c.valor}>
                  {c.rotulo}
                </option>
              ))}
            </select>
          </label>
          <label>
            Data do plantio
            <input
              type="date"
              value={dataPlantio}
              onChange={(e) => setDataPlantio(e.target.value)}
              required
            />
          </label>
          <div className="linha">
            <label>
              Área plantada
              <input
                type="number"
                value={area}
                min={0.01}
                max={unidade === "ha" ? AREA_MAX_HA : AREA_MAX_HA * 10_000}
                step="any"
                onChange={(e) => setArea(e.target.value)}
                required
              />
            </label>
            <label>
              Unidade
              <select value={unidade} onChange={(e) => setUnidade(e.target.value as "m2" | "ha")}>
                <option value="m2">m²</option>
                <option value="ha">ha</option>
              </select>
            </label>
          </div>
          <label>
            Mudas/sementes (opcional)
            <input
              type="number"
              value={mudas}
              min={1}
              max={1_000_000}
              step={1}
              onChange={(e) => setMudas(e.target.value)}
            />
          </label>
          {erro && <p className="erro">{erro}</p>}
          {sucesso && <p className="sucesso">{sucesso}</p>}
          <button type="submit" disabled={enviando}>
            {enviando ? "Salvando..." : "Registrar plantio"}
          </button>
        </form>
      </section>

      <section>
        <h2>Meus plantios</h2>
        <p className="aviso">Colheita, produção e retorno são estimativas simuladas.</p>
        {carregando && <p>Carregando...</p>}
        {erroLista && <p className="erro">{erroLista}</p>}
        {!carregando && !erroLista && plantios.length === 0 && (
          <p>Nenhum plantio registrado ainda.</p>
        )}
        {plantios.length > 0 && (
          <div className="tabela-rolavel">
            <table>
              <thead>
                <tr>
                  <th>Cultura</th>
                  <th>Plantio</th>
                  <th>Área (m²)</th>
                  <th>Colheita</th>
                  <th>Produção (kg)</th>
                  <th>Retorno</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {plantios.map((p) => (
                  <tr key={p.id}>
                    <td>{rotuloCultura(p.cultura)}</td>
                    <td>{formatarData(p.dataPlantio)}</td>
                    <td>{formatarNumero(p.areaM2)}</td>
                    <td>{formatarData(p.dataColheita)}</td>
                    <td>{formatarNumero(p.producaoEsperadaKg)}</td>
                    <td>{formatarMoeda(p.retornoEstimado)}</td>
                    <td>{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
