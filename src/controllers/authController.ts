import type { Request, Response } from "express";
import * as authService from "../services/authService";

export async function cadastrar(req: Request, res: Response): Promise<void> {
  const usuario = await authService.cadastrar(req.body ?? {});
  res.status(201).json(usuario);
}

export async function entrar(req: Request, res: Response): Promise<void> {
  const { email, senha } = req.body ?? {};
  const usuario = await authService.entrar(email, senha);
  res.json(usuario);
}
