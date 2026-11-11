import { Router } from "express";
import { cadastrar, entrar } from "../controllers/authController";

const router = Router();

router.post("/cadastro", cadastrar);
router.post("/login", entrar);

export default router;
