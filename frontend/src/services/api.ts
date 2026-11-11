export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// Lê o usuário salvo pelo AuthProvider para "identificar" a requisição.
// Limitação conhecida: o id identifica, mas não autentica (sem token).
function idDoUsuarioLogado(): string | null {
  try {
    const texto = localStorage.getItem("usuario");
    return texto ? (JSON.parse(texto) as { id: string }).id : null;
  } catch {
    return null;
  }
}

export async function requisitar<T>(
  caminho: string,
  opcoes: { metodo?: string; corpo?: unknown } = {}
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const id = idDoUsuarioLogado();
  if (id) headers["x-usuario-id"] = id;

  const resposta = await fetch(`/api${caminho}`, {
    method: opcoes.metodo ?? "GET",
    headers,
    body: opcoes.corpo ? JSON.stringify(opcoes.corpo) : undefined,
  });

  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    throw new ApiError(dados.erro ?? "Erro inesperado", resposta.status);
  }
  return dados as T;
}
