import { useState, type FormEvent } from "react";
import { cadastrar } from "../services/authService";
import { useAuth } from "../context/auth-context";
import Apresentacao from "../components/Apresentacao";

const NOME_MAX = 100;
const EMAIL_MAX = 254;

interface Props {
  aoTrocar: () => void; // volta para a tela de Login
}

export default function Cadastro({ aoTrocar }: Props) {
  const { login } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro("");
    setEnviando(true);
    try {
      const usuario = await cadastrar(nome, email, senha);
      login(usuario); // o cadastro já devolve o usuário: entra direto no Painel
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="auth">
      <Apresentacao />
      <h1>Criar conta</h1>
      <form onSubmit={aoEnviar}>
        <label>
          Nome
          <input
            type="text"
            value={nome}
            maxLength={NOME_MAX}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </label>
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
          Senha (6 a 72 caracteres)
          <input
            type="password"
            value={senha}
            minLength={6}
            maxLength={72}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </label>
        {erro && <p className="erro">{erro}</p>}
        <button type="submit" disabled={enviando}>
          {enviando ? "Criando..." : "Criar conta"}
        </button>
      </form>
      <p>
        Já tem conta?{" "}
        <button type="button" className="link" onClick={aoTrocar}>
          Entrar
        </button>
      </p>
    </main>
  );
}
