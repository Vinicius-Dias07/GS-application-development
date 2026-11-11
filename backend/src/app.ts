import express from "express";
import authRoutes from "./routes/authRoutes";
import plantioRoutes from "./routes/plantioRoutes";
import { cors } from "./middlewares/cors";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(cors);
app.use(express.json());

app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/plantios", plantioRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
