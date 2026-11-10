export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function requisitar<T>(
  caminho: string,
  opcoes: { metodo?: string; corpo?: unknown } = {}
): Promise<T> {
  const resposta = await fetch(`/api${caminho}`, {
    method: opcoes.metodo ?? "GET",
    headers: { "Content-Type": "application/json" },
    body: opcoes.corpo ? JSON.stringify(opcoes.corpo) : undefined,
  });

  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    throw new ApiError(dados.erro ?? "Erro inesperado", resposta.status);
  }
  return dados as T;
}