import type { NextFunction, Request, Response } from "express";

// CORS manual (sem dependência extra). Em desenvolvimento o proxy do Vite já
// evita o problema; isto vale para quando o front é servido de outra origem.
const ORIGEM = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";

export function cors(req: Request, res: Response, next: NextFunction): void {
  res.setHeader("Access-Control-Allow-Origin", ORIGEM);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-usuario-id");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
}
