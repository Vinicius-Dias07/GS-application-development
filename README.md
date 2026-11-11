# Painel de plantio para agricultura familiar

Projeto acadêmico (FIAP, Global Solution): website para pequenos agricultores
registrarem seus plantios e acompanharem colheita esperada, produção e retorno
estimado.

## Introdução

- **Problema:** pequenos agricultores têm dificuldade de quantificar e planejar
  o que produzem.
- **Público-alvo:** agricultores familiares.
- **Objetivo:** registrar plantios e exibir previsão de colheita, produção e
  retorno, além de indicadores consolidados.
- **ODS:** 2 (Fome zero e agricultura sustentável, principal), 9 (Indústria,
  inovação e infraestrutura) e 10 (Redução das desigualdades).

> **Dados simulados:** ciclo, produtividade e preço de cada cultura são valores
> fictícios (`backend/src/services/referenciaCulturas.ts`). Toda estimativa
> exibida deve ser lida como simulação.

## Stack

TypeScript, Node.js + Express (back), React + Vite (front), MongoDB + Mongoose.

## Arquitetura

Monolito dividido em `backend/` e `frontend/`. O back segue camadas:
`routes → controllers → services → models`. Regras de negócio (validação,
conversão de ha para m², previsão e status) ficam nos *services*.

## Como executar

Pré-requisitos: Node 24 e um MongoDB (ex.: via Podman).

```bash
# 1. MongoDB
podman run -d --name agro-mongo -p 27017:27017 docker.io/library/mongo:7

# 2. Backend (porta 3000). Crie backend/.env com:
#    PORT=3000
#    MONGO_URI=mongodb://localhost:27017/agro
cd backend && npm install && npm run dev

# 3. Frontend (porta 5173), em outro terminal
cd frontend && npm install && npm run dev

# 4. (Opcional) dados de demonstração: login demo@agro.com / demo123
cd backend && npm run seed
```

Acesse http://localhost:5173. Em desenvolvimento, o Vite encaminha `/api` para
o back (proxy). Para servir o front de outra origem, defina `FRONTEND_ORIGIN`
no back (CORS libera o cabeçalho `x-usuario-id`).

## Rotas da API

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/cadastro` | cria agricultor |
| POST | `/api/auth/login` | identifica agricultor |
| POST | `/api/plantios` | registra plantio (exige `x-usuario-id`) |
| GET | `/api/plantios` | lista plantios do agricultor, com previsão |
| GET | `/api/plantios/indicadores` | total, resumo por cultura e por status |

Rotas inexistentes retornam 404 e erros de validação retornam 400 com
`{ "erro": "mensagem" }`.

## Regras de negócio

- Área aceita em m² ou ha (1 ha = 10.000 m²) e é guardada em m².
- Colheita = plantio + ciclo da cultura; produção = área × produtividade;
  retorno = produção × preço.
- Status da safra (derivado das datas): *plantado*; *colheita próxima* (últimos
  7 dias antes da colheita); *pronto para colher* (até 14 dias após a data de
  colheita); *colhido* (depois disso). Não há ação manual de "colher": é uma
  simplificação deliberada.
- A previsão é calculada na leitura, não é gravada.

## Limitações conhecidas

- **Login sem token.** O front guarda o usuário no `localStorage` e envia o id
  no cabeçalho `x-usuario-id`. Isso **identifica, mas não protege**: quem
  conhecer o id de outro agricultor consegue acessar os dados dele. Em um
  sistema real, usaríamos token assinado (JWT) ou sessão.
- Sem edição/exclusão de plantios, papéis, recuperação de senha ou OAuth
  (fora do escopo definido).
- Dados de referência simulados.

## Melhorias futuras

JWT/sessão, edição e exclusão de plantios, marcação manual de colheita, testes
automatizados e referências reais (ex.: dados públicos de preços).
