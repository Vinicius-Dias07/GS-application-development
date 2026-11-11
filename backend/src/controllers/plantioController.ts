import type { Request, Response } from "express";
import * as plantioService from "../services/plantioService";

export async function criar(req: Request, res: Response): Promise<void> {
  const plantio = await plantioService.criar(res.locals.usuarioId, req.body ?? {});
  res.status(201).json(plantio);
}

export async function listar(_req: Request, res: Response): Promise<void> {
  res.json(await plantioService.listar(res.locals.usuarioId));
}

export async function indicadores(_req: Request, res: Response): Promise<void> {
  res.json(await plantioService.indicadores(res.locals.usuarioId));
}
