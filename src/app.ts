import express from "express";

const app = express();

app.use(express.json());

app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.use((_req, res) => {
    res.status(404).json({ erro : "rota nao encontrada"});
});

export default app;