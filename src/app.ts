import express from "express";
import authRoutes from "./routes/authRoutes";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";
import { exigirUsuario } from "./middlewares/exigirUsuario";

const app = express();

app.use(express.json());

app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);

// Rota provisória da Etapa 5: remover quando as rotas de plantio usarem o middleware (Etapa 7)
app.get("/api/teste-protegida", exigirUsuario, (_req, res) => {
    res.json({ usuarioId: res.locals.usuarioId });
});

app.use(notFound);
app.use(errorHandler);

export default app;
