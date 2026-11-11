import { useState, type FormEvent } from "react";
import { entrar } from "../services/authService";
import { useAuth } from "../context/auth-context";
import Apresentacao from "../components/Apresentacao";

const EMAIL_MAX = 254;

interface Props {
  aoTrocar: () => void; // vai para a tela de Cadastro
}

export default function Login({ aoTrocar }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault(); // impede o navegador de recarregar a página
    setErro("");
    setEnviando(true);
    try {
      const usuario = await entrar(email, senha);
      login(usuario);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main>
      <Apresentacao />
      <h1>Entrar</h1>
      <form onSubmit={aoEnviar}>
        <label>
          E-mail
          <input
            type="email"
            value={email}
            maxLength={EMAIL_MAX}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Senha
          <input
            type="password"
            value={senha}
            maxLength={72}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </label>
        {erro && <p className="erro">{erro}</p>}
        <button type="submit" disabled={enviando}>
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <p>
        Não tem conta?{" "}
        <button type="button" onClick={aoTrocar}>
          Criar conta
        </button>
      </p>
    </main>
  );
}
