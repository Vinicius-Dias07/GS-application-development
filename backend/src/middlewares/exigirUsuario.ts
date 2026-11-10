import type { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { Usuario } from "../models/usuario";
import { AppError } from "../errors/AppError";

export async function exigirUsuario(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const id = req.header("x-usuario-id");

  if (!id || !isValidObjectId(id)) {
    throw new AppError("Identificação do agricultor ausente ou inválida", 401);
  }

  const existe = await Usuario.exists({ _id: id });
  if (!existe) {
    throw new AppError("Agricultor não encontrado", 401);
  }

  res.locals.usuarioId = id;
  next();
}
