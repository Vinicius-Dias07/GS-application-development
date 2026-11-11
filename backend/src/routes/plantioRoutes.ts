import { Router } from "express";
import { criar, indicadores, listar } from "../controllers/plantioController";
import { exigirUsuario } from "../middlewares/exigirUsuario";

const router = Router();

router.use(exigirUsuario); // todas as rotas de plantio exigem o agricultor identificado

router.post("/", criar);
router.get("/", listar);
router.get("/indicadores", indicadores);

export default router;
